const router = require("express").Router();
const Response = require('../../network/response');
const Controller = require('./');
const verifyToken = require('../../middlewares/verifyToken');
const Config = require('../../config');
const multer  = require('multer');

const Upload = multer( { dest: Config.upload_folder, fileSize: Config.max_picture_upload_byte_size } );

/* List all the intolerances.*/
router.get('/', (req, res, next) => {
	Controller.list().then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

/* Creates a new intolerance in which dishes are gonna be involved.*/
router.post('/', verifyToken, Upload.single('picture'), (req, res, next) => {
	Controller.post(req.body, req.file).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

/* Update an intolerance name or the image.*/
router.put('/:id', verifyToken, Upload.single('picture'), (req, res, next) => {
	Controller.update(req.params.id, req.body, req.file).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

/* Delete an intolerance.*/
router.delete('/:id', verifyToken, (req, res, next) => {
	Controller.remove(req.params.id).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

module.exports = router;