const config = {
	
	// Server port
	server_port: process.env.PORT || 3000,
	
	// Server environment
	node_env: process.env.NODE_ENV || 'development',
	
	// JWT session
	jwt_secret: process.env.JWT_SECRET || 'test',
	jwt_issuer: process.env.JWT_ISSUER || 'DevStarlight',
	salt_rounds: process.env.SALT_ROUNDS || 10,
	jwt_expires: process.env.JWT_TOKEN_EXPIRATTION || '1y',
	
	// Database configuration
	mongodb_uri: process.env.MONGODB_URI,
	
	// AWS configuration
	aws_secretKey: process.env.AWS_SECRET,
	aws_accessKey: process.env.AWS_ACCESS_KEY,
	aws_region: process.env.AWS_REGION,
	aws_s3Bucket: process.env.AWS_S3_BUCKET,
	
	// Winston 3rd party library
	logLevel: String(process.env.BACKEND_WINSTON_LOG_LEVEL) || 'info',
	
	// Multer 3rd party library
	upload_folder: 'uploads/',
	max_pic_upload_byte_size: process.env.MAX_VIDEO_UPLOAD_BYTE_SIZE || '1500000',
	
	// Default category for deleted dishes
	category_id: process.env.CATEGORY_ID,

	// Guest user
	user_id: process.env.USER_ID,
	
	// Intolerance image size & mimetype
	images_mimeType: process.env.IMAGES_MIMETYPE || 'image/png',
	intolerance_size: process.env.INTOLERANCE_SIZE || 40,
	
	moment_locale: process.env.MOMENT_LOCALE || 'es'
};

module.exports = config;
