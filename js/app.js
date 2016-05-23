app = angular.module("myApp",['ngStorage']);
app.controller('OrderFormController', function($scope,$localStorage){
	/*$scope.$storage = $localStorage.$default({
		x: 42
	});
	$scope.value = $scope.$storage.x;*/
	$scope.value = $localStorage.message;
	$scope.storeLocal = function(){
		//$scope.$storage.x = $scope.value;
		//$scope.$storage.x = $scope.value;
		
		$localStorage.message = $scope.value;
		location.reload();  //native javascript works without any issue
	}
});;

app.filter('to_trusted', ['$sce', function($sce){
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);
app.directive('script', function() {
	return {
	  restrict: 'E',
	  scope: false,
	  link: function(scope, elem, attr) {
		if (attr.type === 'text/javascript-lazy') {
		  var code = elem.text();
		  var f = new Function(code);
		  f();
		}
	  }
	};
});

