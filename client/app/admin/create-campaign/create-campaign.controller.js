(function () {

    'use strict';

    /**
     * Create campaign controller which manages creating a new campaign
     */
    angular
        .module('taskingManager')
        // .controller('createCampaignController', ['$scope', '$location', 'campaignService', 'accountService', 'tagService', 'authService', createCampaignController]);
        .controller('createCampaignController', ['$scope', '$location', 'campaignService', 'tagService', createCampaignController]);

    // function createCampaignController($scope, $location, campaignService, accountService, tagService, authService) {
    function createCampaignController($scope, $location, campaignService, tagService) {

        var vm = this;

        // Wizard
        vm.currentStep = '';
        vm.campaignName = '';
        vm.campaignNameForm = {};

        // waiting spinner
        vm.waiting = false;
        vm.trimError = false;
        vm.trimErrorReason = '';

        // activate();
        //
        // function activate () {
        //
        //     // Check if the user has the PROJECT_MANAGER or ADMIN role. If not, redirect
        //     var session = authService.getSession();
        //     if (session) {
        //         var resultsPromise = accountService.getUser(session.username);
        //         resultsPromise.then(function (user) {
        //             // Returned the user successfully. Check the user's role
        //             if (user.role !== 'PROJECT_MANAGER' && user.role !== 'ADMIN') {
        //                 $location.path('/');
        //             }
        //         }, function () {
        //             // an error occurred, navigate to homepage
        //             $location.path('/');
        //         });
        //     }
        // }

        /**
         * Create a new campaign with a campaign name
         */
        vm.createCampaign = function () {
            if (vm.campaignNameForm.$valid) {
                vm.waiting = true;
                var resultsPromise = campaignService.createCampaign(vm.camapaignName);
                resultsPromise.then(function (data) {
                    vm.waiting = false;
                    // Project created successfully
                    vm.createProjectFail = false;
                    vm.createProjectSuccess = true;
                    vm.createProjectFailReason = '';
                    // Navigate to the edit project page
                    $location.path('/admin/edit-campaign/' + data.campaignId);
                }, function (reason) {
                    vm.waiting = false;
                    // Project not created successfully
                    vm.createCampaignFail = true;
                    vm.createCampaignSuccess = false;
                    vm.createCampaignFailReason = reason.status
                });
            }
            else {
                vm.campaignNameForm.submitted = true;
            }
        };

        /**
         * Set campaign tags
         */
        function setCampaignTags () {
            var resultsPromise = tagService.getCampaignTags();
            resultsPromise.then(function (data) {
                // On success, set the projects results
                vm.campaignTags = data.tags;
            }, function () {
                // On error
                vm.campaignTags = [];
            });
        }

        vm.getCampaignTags = function () {
            return vm.campaignTags;
        };
    }
})();
