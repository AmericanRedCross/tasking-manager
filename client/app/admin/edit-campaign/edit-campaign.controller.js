(function () {

    'use strict';

    /**
     * Edit project controller which manages editing an existing project
     */
    angular
        .module('taskingManager')
        .controller('editCampaignController', ['$scope', '$location', '$routeParams', '$timeout', 'mapService', 'drawService', 'projectService', 'accountService', 'authService', 'tagService', 'userService', 'messageService', 'settingsService', editCampaignController]);

    function editCampaignController($scope, $location, $routeParams, $timeout, mapService, drawService, campaignService, accountService, authService, tagService, userService, messageService, settingsService) {

        var vm = this;
        vm.currentSection = '';
        vm.editForm = {};

        // Locale
        vm.locales = [];

        // Tags
        vm.organisationTags = [];
        vm.campaignsTags = [];
        vm.campaignOrganisationTag = [];
        vm.campaignCampaignTag = [];

        vm.campaign = {};
        vm.campaign.defaultLocale = 'en';
        vm.descriptionLanguage = 'en';
        vm.nameLanguage = 'en';

        vm.descriptionHTML = '';

        // Delete
        vm.showDeleteConfirmationModal = false;

        // Error messages
        vm.deleteProjectFail = false;
        vm.deleteProjectSuccess = false;
        vm.invalidateTasksFail = false;
        vm.invalidateTasksSuccess = false;
        vm.validateTasksFail = false;
        vm.validateTasksSuccess = false;

        // Form
        vm.form = {};

        activate();

        function activate () {

            // Get available languages
            var resultsPromise = settingsService.getSettings();
            resultsPromise.then(function (data) {
                for (var i = 0; i < data.supportedLanguages.length; i++){
                    vm.locales.push(data.supportedLanguages[i].code);
                }
            });

            // Check if the user has the PROJECT_MANAGER or ADMIN role. If not, redirect
            var session = authService.getSession();
            if (session){
                var resultsPromise = accountService.getUser(session.username);
                resultsPromise.then(function (user) {
                    // Returned the user successfully. Check the user's role
                    if (user.role !== 'PROJECT_MANAGER' && user.role !== 'ADMIN'){
                        $location.path('/');
                    }
                }, function(){
                    // an error occurred, navigate to homepage
                    $location.path('/');
                });
            }

            var id = $routeParams.id;

            getCampaign(id);

            vm.currentSection = 'description';
        }

        /**
         * Save edits
         */
        vm.saveEdits = function (){

            // Prepare the data for sending to API by removing any locales with no fields
            if (!requiredFieldsMissing && vm.editForm.$valid){
                for (var i = 0; i < vm.campaign.projectInfoLocales.length; i++){
                    var info = vm.campaign.projectInfoLocales[i];
                    var populatedLocale = false;
                    if (info.description !== '' || info.name !== '') {
                        populatedLocale = true;
                    }
                    // if no fields for this locale are populated, remove from array
                    if (!populatedLocale) {
                        vm.campaign.campaignInfoLocales.splice(i, 1);
                        // decrease the counter because there is one less item in the array
                        i--;
                    }
                }
                var resultsPromise = campaignService.updateProject(vm.campaign.campaignId, vm.campaign);
                resultsPromise.then(function (data) {
                    // Project updated successfully
                    vm.updateCampaignFail = false;
                    vm.updateCampaignSuccess = true;
                    // Reset the page elements
                    getCampaign(vm.campaign.campaignId);
                }, function () {
                    // Project not updated successfully
                    vm.updateCampaignFail = true;
                    vm.updateCampaignSuccess = false;
                });
            }
        };

        /**
         * Change the language of the description
         * @param language
         */
        vm.changeLanguageDescription = function (language) {
            vm.descriptionLanguage = language;
        };

        /**
         * Change the language of name field
         * @param language
         */
        vm.changeLanguageName = function(language){
            vm.nameLanguage = language;
        };

        /**
         * Change the default locale
         * @param language
         */
        vm.changeDefaultLocale = function(language){
            vm.campaign.defaultLocale = language;
            vm.nameMissing = false;
            vm.descriptionMissing = false;
            vm.shortDescriptionMissing = false;
            vm.instructionsMissing = false;
        };

        /**
         * Navigate to the homepage
         */
        vm.goToHome = function(){
            $location.path('/');
        };

        /**
         * Set the delete confirmation modal to visible/invisible
         * @param showModal
         */
        vm.showDeleteConfirmation = function (showModal) {
            vm.showDeleteConfirmationModal = showModal;
            if (!showModal && vm.deleteProjectSuccess){
                $location.path('/');
            }
        };

        /**
         * Delete a campaign
         */
        vm.deleteCampaign = function () {
            vm.deleteCampaignFail = false;
            vm.deleteCampaignSuccess = false;
            var resultsPromise = campaignService.deleteCampaign(vm.campaign.campaignId);
            resultsPromise.then(function () {
                // Campaign deleted successfully
                vm.deleteCampaignFail = false;
                vm.deleteCampaignSuccess = true;
                // Reset the page elements
                getCampaign(vm.campaign.campaignId);
            }, function(){
                // Project not deleted successfully
                vm.deleteCamapaignFail = true;
                vm.deleteCampaignSuccess = false;
            });
        }

        /**
         * Check the required fields for the default locale
         * @return boolean if something is missing (description, short description or instructions for the default locale
         */
        function checkRequiredFields(){
            vm.nameMissing = false;
            vm.descriptionMissing = false;
            vm.shortDescriptionMissing = false;
            vm.instructionsMissing = false;
            vm.instructionsMissing = false;
            for (var i = 0; i < vm.campaign.campaignInfoLocales.length; i++) {
                if (vm.campaign.projectInfoLocales[i].locale === vm.campaign.defaultLocale) {
                    // check that the name, short description, description and instructions are populated for the default locale
                    var info = vm.campaign.projectInfoLocales[i];
                    if (typeof info.name === 'undefined' || info.name === ''){
                        vm.nameMissing = true;
                    }
                    if (typeof info.description === 'undefined' || info.description === ''){
                        vm.descriptionMissing = true;
                    }
                    break;
                }
            }
            var somethingMissing = vm.name || vm.descriptionMissing;
            return somethingMissing;
        }

        /**
         * Get project metadata
         * @param id
         */
        function getCampaign (id) {
            vm.errorReturningCampaignMetadata = false;
            var resultsPromise = campaignService.getCampaign(id);
            resultsPromise.then(function (data) {
                vm.source.clear(); // clear the priority areas
                vm.campaign = data;
                for (var i = 0; i < vm.locales.length; i++) {
                    var found = false;
                    for (var j = 0; j < vm.campaign.campaignInfoLocales.length; j++) {
                        if (vm.locales[i] === vm.campaign.campaignInfoLocales[j].locale) {
                            found = true;
                            break;
                        }
                    }
                    if (!found){
                        // Add an empty projectInfoLocale
                        var locale = {
                            "locale": vm.locales[i],
                            "name": "",
                            "description": ""
                        };
                        vm.campaign.campaignInfoLocales.push(locale);
                    }
                }
            }, function(){
                vm.errorReturningProjectMetadata = true;
            });
        }

        /**
         * Set campaign tags
         */
        // function setCampaignTags(){
        //     var resultsPromise = tagService.getCampaignTags();
        //     resultsPromise.then(function (data) {
        //         // On success, set the projects results
        //         vm.campaignTags = data.tags;
        //     }, function () {
        //         // On error
        //         vm.campaignTags = [];
        //     });
        // }

        /**
         * Get the default language name
         */
        function getProjectNameForDefaultLocale(){
            var projectName = '';
            var projectInfo = vm.campaign.projectInfoLocales;
            for (var i = 0; i < projectInfo.length; i++){
                if (projectInfo[i].locale === vm.campaign.defaultLocale) {
                    projectName = projectInfo[i].name;
                    return projectName;
                }
            }
            return projectName;
        }
    }
})();
