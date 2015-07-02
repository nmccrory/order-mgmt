var storeModule = angular.module('StoreApp', ['ngRoute']);

storeModule.config(function ($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'partials/customers.html'
	})
	.when('/orders', {
		templateUrl: 'partials/orders.html'
	})
	.otherwise({
		redirectTo: '/'
	})
})

storeModule.factory('CustomerFactory', function($http){
	var factory = {};
	var customers = [];
	factory.getCustomers = function(callback){
		$http.get('/customers').success(function(output){
			var customers = output;
			callback(customers);
		})
	}
	factory.addCustomer = function(info, callback){
		$http.post('/addC', info).success(function(output){
			callback();
		})
	}
	factory.removeCustomer = function(id, callback){
		$http.get('/destroy/'+id).success(function(){
			callback();
		})
	}
	return factory;
})

storeModule.factory('OrderFactory', function($http){
	var factory = {};
	var orders = [];
	factory.getOrders = function(callback){
		$http.get('/getorders').success(function(output){
			var orders = output;
			callback(orders);
		})
	}

	factory.addOrder = function(info, callback){
		$http.post('/addorder', info).success(function(){
			callback();
		})
	}
	return factory;
})

storeModule.controller('customersController', function(CustomerFactory){
	var that = this;

	this.getCustomers = function(){
		CustomerFactory.getCustomers(function(data){
			that.customers = data;
		});
	}
	this.getCustomers();

	this.addcustomer = function(){
		that.error = '';
		for(customer in this.customers){
			if(this.customers[customer].name == that.newCustomer.name){
				that.error = 'Customer name already exists';
				return false;
			}
		}
		CustomerFactory.addCustomer(that.newCustomer, function(){
			that.getCustomers();

			that.newCustomer = {};
		})
	}

	this.removecustomer = function(customer){
		CustomerFactory.removeCustomer(customer._id, function(){
			that.getCustomers();
		})
	}
})

storeModule.controller('ordersController', function(OrderFactory){
	var that = this;
	this.products = ['Nike Flyknit Racer', 'Macbook Air', 'iPhone', 'Ferrari 450 Italia', 'Samsung 4k Television'];

	OrderFactory.getOrders(function(data){
		that.orders = data;
	})

	this.addorder = function(){
		OrderFactory.addOrder(that.newOrder, function(){
			OrderFactory.getOrders(function(data){
				that.orders = data;
			})
		})
	}
})