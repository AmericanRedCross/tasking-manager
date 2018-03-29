from schematics import Model
from schematics.types import StringType, IntType, BooleanType
from schematics.types.compound import ListType, ModelType

from .project_dto import ProjectDTO


class CampaignDTO(Model):
    """ Describes JSON model for a tasking manager campaign """
    campaign_id = IntType(serialized_name='campaignId')
    banner = StringType(required=True)
    name = StringType(required=True)
    description = StringType(required=True)
    promoted = BooleanType()
    projects = ListType(ModelType(ProjectDTO))


class CampaignListDTO(Model):
    """ DTO for all campaigns """
    def __init__(self):
        super().__init__()
        self.campaigns = []

    campaigns = ListType(ModelType(CampaignDTO))
