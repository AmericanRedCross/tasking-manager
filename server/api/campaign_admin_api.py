from flask_restful import request, current_app
from schematics.exceptions import DataError

from server.services.users.authentication_service import token_auth, tm

from .campaign_apis import CampaignAPI
from ..models.dtos.campaign_dto import CampaignDTO
from ..services.campaign_admin_service import CampaignAdminService, CampaignAdminServiceError, NotFound, InvalidData


class CampaignAdminAPI(CampaignAPI):
    @tm.pm_only()
    @token_auth.login_required
    def put(self):
        """
        Creates a campaign
        ---
        tags:
            - campaign-admin
        produces:
            - application/json
        parameters:
            - in: header
              name: Authorization
              description: Base64 encoded session token
              required: true
              type: string
              default: Token sessionTokenHere==
            - in: body
              name: body
              required: true
              description: JSON object for creating a campaign
              schema:
                  properties:
                      banner:
                          type: string
                      name:
                          type: string
                      description:
                          type: string
                      promoted:
                          type: boolean
        responses:
            201:
                description: Campaign created successfully
            400:
                description: Client Error - Invalid Request
            401:
                description: Unauthorized - Invalid credentials
            500:
                description: Internal Server Error
        """
        try:
            campaign_dto = CampaignDTO(request.get_json())
            campaign_dto.validate()
        except DataError as e:
            current_app.logger.error(f'error validating request: {str(e)}')
            return str(e), 400

        try:
            campaign_id = CampaignAdminService.create_campaign(campaign_dto)
            return {"campaignId": campaign_id}, 201
        except InvalidData as e:
            return {"error": f'{str(e)}'}, 400
        except Exception as e:
            error_msg = f'Campaign PUT - unhandled error: {str(e)}'
            current_app.logger.critical(error_msg)
            return {"error": error_msg}, 500

    @tm.pm_only()
    @token_auth.login_required
    def post(self, campaign_id):
        """
        Updates a campaign
        ---
        tags:
            - campaign-admin
        produces:
            - application/json
        parameters:
            - in: header
              name: Authorization
              description: Base64 encoded session token
              required: true
              type: string
              default: Token sessionTokenHere==
            - name: campaign_id
              in: path
              description: The unique campaign ID
              required: true
              type: integer
              default: 1
            - in: body
              name: body
              required: true
              description: JSON object for creating a campaign
              schema:
                  properties:
                      banner:
                          type: string
                      name:
                          type: string
                      description:
                          type: string
                      promoted:
                          type: boolean
        responses:
            200:
                description: Project updated
            400:
                description: Client Error - Invalid Request
            401:
                description: Unauthorized - Invalid credentials
            404:
                description: Project not found
            500:
                description: Internal Server Error
        """
        try:
            campaign_dto = CampaignDTO(request.get_json())
            campaign_dto.campaign_id = campaign_id
            campaign_dto.validate()
        except DataError as e:
            current_app.logger.error(f'Error validating request: {str(e)}')
            return str(e), 400

        try:
            CampaignAdminService.update_campaign(campaign_dto)
            return {"Status": "Updated"}, 200
        except NotFound:
            return {"Error": "Campaign Not Found"}, 404
        except CampaignAdminServiceError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            error_msg = f'Campaign GET - unhandled error: {str(e)}'
            current_app.logger.critical(error_msg)
            return {"error": error_msg}, 500

    @tm.pm_only()
    @token_auth.login_required
    def delete(self, campaign_id):
        """
        Deletes a campaign
        ---
        tags:
            - campaign-admin
        produces:
            - application/json
        parameters:
            - in: header
              name: Authorization
              description: Base64 encoded session token
              required: true
              type: string
              default: Token sessionTokenHere==
            - name: campaign_id
              in: path
              description: The unique campaign ID
              required: true
              type: integer
              default: 1
        responses:
            200:
                description: Campaign deleted
            401:
                description: Unauthorized - Invalid credentials
            404:
                description: Project not found
            500:
                description: Internal Server Error
        """
        try:
            CampaignAdminService.delete_campaign(campaign_id)
            return {"Success": "Campaign deleted"}, 200
        except NotFound:
            return {"Error": "Campaign Not Found"}, 404
        except Exception as e:
            error_msg = f'Campaign GET - unhandled error: {str(e)}'
            current_app.logger.critical(error_msg)
            return {"error": error_msg}, 500
