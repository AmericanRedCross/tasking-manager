(function () {

    'use strict';

    /**
     * Create campaign controller which manages creating a new campaign
     */
    angular
        .module('taskingManager')
        .controller('createCampaignController', ['$scope', '$location', 'campaignService', 'accountService', 'authService', createCampaignController]);

    function createCampaignController($scope, $location, campaignService, accountService, authService) {

        var vm = this;

        // Wizard
        vm.currentStep = '';
        vm.campaignName = '';
        vm.campaignNameForm = {};

        //waiting spinner
        vm.waiting = false;
        vm.trimError = false;
        vm.trimErrorReason = '';

        activate();

        function activate() {

            // Check if the user has the PROJECT_MANAGER or ADMIN role. If not, redirect
            var session = authService.getSession();
            if (session) {
                var resultsPromise = accountService.getUser(session.username);
                resultsPromise.then(function (user) {
                    // Returned the user successfully. Check the user's role
                    if (user.role !== 'PROJECT_MANAGER' && user.role !== 'ADMIN') {
                        $location.path('/');
                    }
                }, function () {
                    // an error occurred, navigate to homepage
                    $location.path('/');
                });
            }
        }

        /**
         * Set the current wizard step in the process of creating a campaign
         * @param wizardStep the step in the wizard the user wants to go to
         */
        vm.setWizardStep = function (wizardStep) {
            if (wizardStep === 'name') {
                setSplitToolsActive_(false);
                vm.createCampaignFailed = false;
                vm.createCampaignFailReason = '';
                vm.currentStep = wizardStep;
            }
            else {
                vm.currentStep = wizardStep;
            }
        };

        /**
         * Decides if a step should be shown as completed in the progress bar
         * @param wizardStep
         * @returns {boolean}
         */
        vm.showWizardStep = function (wizardStep) {
            var showStep = false;
            if (wizardStep === 'name') {
                if (vm.currentStep === 'name') {
                    showStep = true;
                }
            }
            else {
                showStep = false;
            }
            return showStep;
        };


        /**
         * Set campaign tags
         */
        function setCampaignTags(){
            var resultsPromise = tagService.getCampaignTags();
            resultsPromise.then(function (data) {
                // On success, set the projects results
                vm.campaignTags = data.tags;
            }, function () {
                // On error
                vm.campaignTags = [];
            });
        }

        vm.getCampaignTags = function(){
            return vm.campaignTags;
        };
    }
})();
