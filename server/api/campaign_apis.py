from flask_restful import Resource, current_app
from server.services.campaign_service import CampaignService, CampaignServiceError, NotFound


class CampaignListAPI(Resource):
    def get(self):
        """
        Get all HOT Campaigns
        ---
        produces:
            - application/json
        responses:
            200:
                description: Campaign found
            403:
                description: Forbidden
            404:
                description: Campaign not found
            500:
                description: Internal Server Error
        """
        try:
            campaigns = CampaignService.get_all()

            return campaigns.to_primitive(), 200
        except CampaignServiceError as e:
            return {"error": str(e)}, 403
        except Exception as e:
            error_msg = f'Campaign GET - unhandled error: {str(e)}'
            current_app.logger.critical(error_msg)
            return {"error": error_msg}, 500


class CampaignAPI(Resource):
    def get(self, campaign_id):
        """
        Get HOT Campaign for mapping
        ---
        produces:
            - application/json
        parameters:
            - name: project_id
              in: path
              description: The unique project ID
              required: true
              type: integer
              default: 1
        responses:
            200:
                description: Campaign found
            403:
                description: Forbidden
            404:
                description: Campaign not found
            500:
                description: Internal Server Error
        """
        try:
            campaign_dto = CampaignService.get_by_id(campaign_id)
            campaign_dto = campaign_dto.to_primitive()

            return campaign_dto, 200
        except NotFound:
            return {"Error": "Campaign Not Found"}, 404
        except CampaignServiceError as e:
            return {"error": str(e)}, 403
        except Exception as e:
            error_msg = f'Campaign GET - unhandled error: {str(e)}'
            current_app.logger.critical(error_msg)
            return {"error": error_msg}, 500
