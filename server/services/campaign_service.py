from flask import current_app

from server.models.postgis.campaign import Campaign
from server.models.postgis.utils import NotFound


class CampaignServiceError(Exception):
    """ Custom Exception to notify callers an error occurred when handling campaigns """

    def __init__(self, message):
        if current_app:
            current_app.logger.error(message)


class CampaignService:
    @staticmethod
    def get_by_id(id: int) -> Campaign:
        campaign = Campaign.get(id)

        if campaign is None:
            raise NotFound()

        return campaign

    @staticmethod
    def get_all():
        """ Get all campaigns """
        return Campaign.get_all()
