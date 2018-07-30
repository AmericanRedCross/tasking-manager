(function () {
    'use strict';

    angular
        .module('taskingManager')
        .service('campaignService', ['$http', '$q', 'configService', 'authService', 'languageService', campaignService]);

    /**
     * @fileoverview This file provides a campaign service.
     */
    function campaignService($http, $q, configService, authService, geospatialService, languageService) {

        var service = {
            createCampaign: createCampaign,
            updateCampaign: updateCampaign,
            deleteCampaign: deleteCampaign,
            getCampaign: getCampaign,
            getCampaigns: getCampaigns
        };

        return service;

        /**
         * Creates a campaign
         * @param campaignName
         * @returns {*|!jQuery.Promise|!jQuery.jqXHR|!jQuery.deferred}
         */
        function createCampaign(campaignName) {

            // Get the campaign with only the name.
            var newCampaign = {
                campaignName: campaignName,
            };

            // Returns a promise
            return $http({
                method: 'PUT',
                url: configService.tmAPI + '/admin/campaigns',
                data: newCampaign,
                headers: authService.getAuthenticatedHeader()
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                return (response.data);
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return $q.reject(response);
            });
        }

        /**
         * Updates a campaign
         * @param id
         * @param campaignData
         * @returns {*|!jQuery.deferred|!jQuery.jqXHR|!jQuery.Promise}
         */
        function updateCampaign(id, campaignData) {

            // Returns a promise
            return $http({
                method: 'POST',
                url: configService.tmAPI + '/admin/campaigns/' + id,
                data: campaignData,
                headers: authService.getAuthenticatedHeader()
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                return response.data;
            }, function errorCallback() {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return $q.reject("error");
            })
        }

        /**
         * Deletes a campaign
         * @param id
         * @returns {*|!jQuery.Promise|!jQuery.deferred|!jQuery.jqXHR}
         */
        function deleteCampaign(id) {

            // Returns a promise
            return $http({
                method: 'DELETE',
                url: configService.tmAPI + '/admin/campaigns/' + id,
                headers: authService.getAuthenticatedHeader()
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                return response.data;
            }, function errorCallback() {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return $q.reject("error");
            })
        }

        /**
         * Get a campaign JSON
         * @param id - campaign id
         * @returns {!jQuery.Promise|*|!jQuery.deferred|!jQuery.jqXHR}
         */
        function getCampaign(id) {

            var preferredLanguage = languageService.getLanguageCode();

            // Returns a promise
            return $http({
                method: 'GET',
                url: configService.tmAPI + '/campaigns/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept-Language': preferredLanguage
                }
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                return response.data;
            }, function errorCallback() {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return $q.reject("error");
            });
        }


        /**
         * Get all campaigns
         * @returns {*|!jQuery.jqXHR|!jQuery.deferred|!jQuery.Promise}
         */
        function getCampaigns() {
            // Returns a promise
            return $http({
                method: 'GET',
                url: configService.tmAPI + '/admin/campaigns',
                headers: authService.getAuthenticatedHeader()
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                return response.data;
            }, function errorCallback() {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return $q.reject("error");
            });
        }
    }
})();
