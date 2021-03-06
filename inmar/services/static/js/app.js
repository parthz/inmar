// App initialization
var baseApp = angular.module('baseApp', ['services', 'BroadcastBox', 'datatables', 'ui.bootstrap']);

// Config
baseApp.config(['$interpolateProvider','$httpProvider', '$compileProvider',
    function($interpolateProvider,$httpProvider,$compileProvider) {
        $compileProvider.debugInfoEnabled(false); 
        $httpProvider.useApplyAsync(true);
        $interpolateProvider.startSymbol('{[');
        $interpolateProvider.endSymbol(']}');
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;odata=verbose'; 
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.common['X-CSRFToken'] = $('#csrf_token').val();
        // $httpProvider.interceptors.push('httpInterceptor');           
}]);


////////////////////// Controllers
// Parent Controller
baseApp.controller('baseController',['$scope','$location','$http','$timeout', '$rootScope', '$modal', 'User',
    function($scope, $location, $http, $timeout, $rootScope, $modal, User){

}]);


// SKUSearch Controller
baseApp.controller('SKUSearchController',['$scope','$location','$http','$timeout', '$rootScope', 'Notify', '$q', 'DTOptionsBuilder', 'Loading',
function($scope, $location, $http, $timeout, $rootScope, Notify, $q, DTOptionsBuilder, Loading){

    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions()

    function fnThatReturnsAPromise() {
        var defer = $q.defer();
        defer.resolve(false);
        return defer.promise;
    }

    $scope.searchSKU = function(){
        Loading.start();
        $http({
            method:'GET',
            url:'/api/v1/sku_search/',
            params: {
                location: $scope.location,
                department: $scope.department,
                category: $scope.category,
                subcategory: $scope.subcategory,                
            },
            header: {
                'Content-Type': 'application/json',
            }
        }).then(function(data){
            $scope.sku_results = data.data;
            Loading.stop();
        }, function(data) {
            Notify.error(data.data.message);
            Loading.stop();            
        });
    };
}]);


baseApp.controller('FlushController',['$scope','$location','$http','$timeout', '$rootScope', 'Notify', '$q', 'DTOptionsBuilder', 'Loading',
function($scope, $location, $http, $timeout, $rootScope, Notify, $q, DTOptionsBuilder, Loading){

    $scope.flush = function(){
        // For demo only
        Loading.start();
        $http({
            method:'GET',
            url:'/api/v1/stock/flush/'
        }).then(function(data){
            Loading.stop();
            Notify.success(data.data.message);
        }, function(data) {
            Notify.error("Something went wrong");
            Loading.stop();            
        });
    };
}]);


// UserSearch Controller
baseApp.controller('UserSearchController',['$scope','$location','$http','$timeout', '$rootScope', 'Notify', '$q', 'DTOptionsBuilder', 'Loading', 'User', '$modal',
function($scope, $location, $http, $timeout, $rootScope, Notify, $q, DTOptionsBuilder, Loading, User, $modal){

    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions()

    function fnThatReturnsAPromise() {
        var defer = $q.defer();
        defer.resolve(false);
        return defer.promise;
    }

    $scope.searchUser = function(){
        Loading.start();
        User.list().then(function(data){
            console.log(data);
            $scope.user_results = data.data;
            Loading.stop();
        }, function(data) {
            Notify.error(data.data.message);
            Loading.stop();            
        });
    };

    $scope.addUser = function() {
        var modalInstance = $modal.open({
            templateUrl: '/static/partials/add_user.html',
            scope:$scope,
            size: 'lg lg-todo',
            resolve: {
                attrs: function(){
                    return [];
                },
            },    
            controller: function($scope, $modalInstance, attrs, $timeout, User){
                $scope.saveUser = function(){
                    var payload = {
                        username: $scope.username,
                        first_name: $scope.first_name,
                        last_name: $scope.last_name,
                        password: $scope.password
                    }
                    User.create(payload).then(function(data){
                        Notify.success("User created Successfully");
                        $scope.modalSelect();
                    }, function(data){
                        Notify.error("Something went wrong");
                    });
                };

                $scope.modalSelect = function () {
                    $modalInstance.close();
                };

                $scope.modalClose = function () {
                     $modalInstance.dismiss('cancel');
                };
            },
        });
        modalInstance.result.then(function(data){
            $scope.searchUser();
        });
    };
}]);
