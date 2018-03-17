var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var convertObjectId = require('mongodb').ObjectId;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'website';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Them du lieu. */
router.get('/add', function(req, res, next) {
  res.render('add-new', { title: 'Add New' });
});

/* Them du lieu. */
router.post('/add', function(req, res, next) {
	//var name = req.body.name , price = req.body.price;
	var data = {
		"name" : req.body.name,
		"price" : req.body.price
	};
	const insertDocuments = function(db, callback) {
		// Get the documents collection
		const collection = db.collection('sanpham1');
		// Insert some documents
		collection.insert(data, function(err, result) {
		  assert.equal(err, null);
		  console.log("Inserted data successfully");
		  callback(result);
		});
	}

	// Use connect method to connect to the server
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		console.log("Connected successfully to server");
	
		const db = client.db(dbName);
	
		insertDocuments(db, function() {
			client.close();
		});
	});
	res.redirect('/view');
});

/* lay ra danh sach . */
router.get('/view', function(req, res, next) {

	const findDocuments = function(db, callback) {
		// Get the documents collection
		const collection = db.collection('sanpham1');
		// Find some documents
		collection.find({}).toArray(function(err, docs) {
		  assert.equal(err, null);
		  callback(docs);
		});
	}
	// Use connect method to connect to the server
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
	
		const db = client.db(dbName);
		findDocuments(db, function(dulieu) {
			res.render('View', { title: 'Danh sach', dulieu : dulieu });
			client.close();
		});
	
	});
	
});

/* Xóa dữ liệu. */
router.get('/delete/:id', function(req, res, next) {
	var id = convertObjectId(req.params.id);
	// câu lệnh xóa 
	const removeDocument = function(db, callback) {
		// Get the documents collection
		const collection = db.collection('sanpham1');
		// Delete document where a is 3
		collection.deleteOne({ _id : id }, function(err, result) {
		  assert.equal(err, null);
		  console.log("Removed the document with the field a equal to 3");
		  callback(result);
		 
		});    
	}

	// kết nối mongo
	// Use connect method to connect to the server
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);		
		removeDocument(db, function() {
		client.close();
		res.redirect('/view');
		});
	});
	
});

/* Sửa dữ liệu. */
router.get('/edit/:id', function(req, res, next) {
	var id = convertObjectId(req.params.id);
	const findDocuments = function(db, callback) {
		// Get the documents collection
		const collection = db.collection('sanpham1');
		// Find some documents
		collection.find({ _id : id}).toArray(function(err, docs) {
		  assert.equal(err, null);
		  console.log('tim thay du lieu');
		  callback(docs);
		});
	}

	// Use connect method to connect to the server
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);
		findDocuments(db, function(dulieu) {
			res.render('edit', { title: 'Chỉnh sửa dữ liệu', dulieu : dulieu });
			client.close();
		});
	
	});
});

  /* GET home page. */
router.post('/edit/:id', function(req, res, next) {
	var id = convertObjectId(req.params.id);

	var data = {
		"name" : req.body.name,
		"price" : req.body.price
	};

	const updateDocument = function(db, callback) {
		// Get the documents collection
		const collection = db.collection('sanpham1');
		// Update document where a is 2, set b equal to 1
		collection.updateOne({ _id : id }
		  , { $set: data }, function(err, result) {
		  assert.equal(err, null);
		  console.log("Updated the document with the field a equal to 2");
		  callback(result);
		});  
	}

	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);
		updateDocument(db, function() {
			client.close();
			res.redirect('/view');
		});
	});

});
  


module.exports = router;
