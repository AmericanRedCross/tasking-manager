from server import db
from server.models.dtos.campaign_dto import CampaignDTO, CampaignListDTO

from .project import Project


class Campaign(db.Model):
    """ Describes a HOT Campaign """
    __tablename__ = 'campaigns'

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    banner = db.Column(db.String)
    name = db.Column(db.String)
    description = db.Column(db.String)
    promoted = db.Column(db.Boolean, default=False)
    # projects = db.relationship(Project, lazy='dynamic', cascade='none')

    @classmethod
    def create_from_dto(cls, dto: CampaignDTO) -> int:
        """ Creates a new Campaign class from dto """
        new_campaign = cls()
        new_campaign.banner = dto.banner
        new_campaign.name = dto.name
        new_campaign.description = dto.description
        new_campaign.promoted = dto.promoted

        db.session.add(new_campaign)
        db.session.commit()

        return new_campaign.id

    def as_dto(self) -> CampaignDTO:
        """ Casts message object to DTO """
        dto = CampaignDTO()
        dto.campaign_id = self.id
        dto.banner = self.banner
        dto.name = self.name
        dto.description = self.description
        dto.promoted = self.promoted
        dto.projects = self.projects

        return dto

    def create(self):
        """ Creates and saves the current model to the DB """
        db.session.add(self)
        db.session.commit()

    def save(self):
        """ Save changes to db """
        db.session.commit()

    @staticmethod
    def get(campaign_id: int):
        """
        Gets specified campaign
        :param campaign_id: campaign ID in scope
        :return: Campaign if found otherwise None
        """
        return Campaign.query.get(campaign_id)

    @staticmethod
    def get_all() -> CampaignListDTO:
        """ Gets all campaigns currently stored """
        results = Campaign.query.all()

        dto = CampaignListDTO()

        for result in results:
            dto.campaigns.append(result.as_dto)

        return dto

    def update(self, campaign_dto: CampaignDTO):
        """ Updates campaign from DTO """
        self.banner = campaign_dto.banner
        self.name = campaign_dto.name
        self.description = campaign_dto.description
        self.promoted = campaign_dto.promoted

        db.session.commit()

    def delete(self):
        """ Deletes the current model from the DB """
        db.session.delete(self)
        db.session.commit()
