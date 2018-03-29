from flask import current_app

from ..models.dtos.campaign_dto import CampaignDTO
from ..models.postgis.campaign import Campaign
from ..models.postgis.utils import InvalidData, NotFound


class CampaignAdminServiceError(Exception):
    """ Custom Exception to notify callers an error occurred when validating a campaign """

    def __init__(self, message):
        if current_app:
            current_app.logger.error(message)


class CampaignAdminService:
    @staticmethod
    def create_campaign(campaign_dto: CampaignDTO) -> int:
        """
        Validates and then persists campaigns in the DB
        :param campaign_dto: Campaign DTO with data from API
        :returns ID of new campaign
        """
        return Campaign.create_from_dto(campaign_dto)

    @staticmethod
    def _get_campaign_by_id(campaign_id: int) -> Campaign:
        campaign = Campaign.get(campaign_id)

        if campaign is None:
            raise NotFound()

        return campaign

    @staticmethod
    def update_campaign(campaign_dto: CampaignDTO):
        campaign = CampaignAdminService._get_campaign_by_id(campaign_dto.campaign_id)

        campaign.update(campaign_dto)

        return campaign

    @staticmethod
    def delete_campaign(campaign_id: int):
        """ Deletes a campaign """
        CampaignAdminService._get_campaign_by_id(campaign_id).delete()
