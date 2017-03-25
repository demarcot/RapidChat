(function () {
    'use strict';

    angular
        .module('coreApp')
        .factory('ChatRoomService', Service);

    function Service($http, $q) {
        var service = {};

        // service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.InsertMessage = InsertMessage;
        service.GetMessages = GetMessages;
        service.GetAllowedChatrooms = GetAllowedChatrooms;
        service.getById = getById;
        // service.GetByUsername = GetByUsername;
        service.Create = Create;
        // service.Update = Update;
        service.Delete = Delete;
        service.checkNotify = checkNotify;

        return service;

        // function GetCurrent() {
        //     return $http.get('/api/users/current').then(handleSuccess, handleError);
        // }
        //
        function GetAll() {
            return $http.get('/test/api/getAllChatrooms').then(handleSuccess, handleError);
        }
        function GetAllowedChatrooms(username) {
            return $http.post('/test/api/getAllowedChatrooms', username).then(handleSuccess, handleError);
        }
        function InsertMessage(message) {
            return $http.post('/test/api/insertMessage', message).then(handleSuccess, handleError);
        }
        function GetMessages(chatRoom) {
            return $http.post('/test/api/getMessages', chatRoom).then(handleSuccess, handleError);
        }
        function getById(chatRoomId) {
            return $http.post('/test/api/getById', chatRoomId).then(handleSuccess, handleError);
        }
        function notifyCheck(chatRoomInfo) {
            return $http.post('/test/api/notifyCheck', chatRoomInfo).then(handleSuccess, handleError);
        }
        //
        // function GetById(_id) {
        //     return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
        // }
        //
        // function GetByUsername(username) {
        //     return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        // }

        function Create(chatRoom) {
            return $http.post('/test/api/createChatroom', chatRoom).then(handleSuccess, handleError);
        }

        // function Update(user) {
        //     return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
        // }

        // function Delete(_id) {
        //     return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
        // }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
