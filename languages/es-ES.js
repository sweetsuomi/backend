let lang = {
	INTERNAL_ISSUE: "Problema interno. Contactar con el administrador.",
	NOT_DEFINED: "no está definido.",
	NOT_EXPECTED_TYPE: "El campo es incorrecto.",
	NOT_NEGATIVE_NUMBER: "El número no puede ser negativo.",
	NOT_VALID_PHONE: "El número de teléfono es incorrecto.",
	STRING_IS_LONG: "El texto es demasiado largo.",
	STRING_IS_SHORT: "El texto es demasiado pequeño.",
	INVALID_DATE: "La fecha introducida no puede ser pasada.",
	DATABASE_ERROR: "Estamos experimentando problemas técnicos. Inténtalo de nuevo mas tarde.",
	// ACCOUNT
	EMAIL_IS_REQUIRED: "El email es obligatorio.",
	EMAIL_NOT_VALID: "El email no es válido. Prueba con otro diferente.",
	EMAIL_IS_SHORTER: "La nombre de usuario es demasiado corto. Prueba con una mas largo.",
	EMAIL_IS_LONGER: "La nombre de usuario es demasiado largo. Prueba con una mas corto.",
	EMAIL_IN_USE: "El email ya está en uso. Prueba con otro diferente.",
	PASSWORD_IS_REQUIRED: "La contraseña es obligatoria.",
	PASSWORD_IS_NOT_VALID: "La contraseña introducida no es válida.",
	PASSWORD_IS_SHORTER: "La contraseña es demasiado corta. Prueba con una mas larga.",
	PASSWORD_IS_LONGER: "La contraseña es demasiado larga. Prueba con una mas corta.",
	ACCOUNT_REGISTER_ERROR: "La cuenta no ha podido ser creada.",
	// USER
	USER_NOT_EXIST: "El usuario que buscas no existe.",
	NICKNAME_IS_REQUIRED: "El nombre de usuario es obligatorio.",
	NICKNAME_IS_NOT_VALID: "El nombre de usuario no es válido.",
	NICKNAME_IS_SHORTER: "El nombre de usuario es demasiado corto. Usa uno mas largo.",
	NICKNAME_IS_LONGER: "El nombre de usuario es demasiadod largo. Usa uno mas corto.",
	NICKNAME_IN_USE: "El nombre de usuario ya está en uso. Usa uno diferente.",
	PHONE_IS_NOT_VALID: "El teléfono introducido no es válido.",
	ADDRESS_IS_NOT_VALID: "La dirección facilitada no es válida.",
	ADDRESS_IS_LONGER: "La dirección facilitada es demasiado larga. Prueba con una mas corta.",
	ADDRESS_IS_SHORTER: "La dirección facilitada es demasiado corta. Prueba con una mas larga.",
	COMPANY_NAME_IS_NOT_VALID: "EL nombre de la empresa no es válido.",
	COMPANY_NAME_IS_SHORTER: "El nombre de la empresa facilitado es demasiado corto. Usa uno mas largo.",
	COMPANY_NAME_IS_LONGER: "El nombre de la empresa facilitado es demasiado largo. Usa uno mas corto.",
	USER_REGISTER_ERROR: "El usuario no ha podido ser registrado.",
	// CATEGORY
	CATEGORY_ID_NOT_DEFINED: "El id de la categoría es necesario.",
	CATEGORY_ID_NOT_VALID: "La categoría que intentas borrar no es válida.",
	CATEGORY_NAME_NOT_DEFINED: "El nombre de la categoría es necesario.",
	CATEGORY_NAME_NOT_VALID: "El nombre de la categoría no es válido.",
	CATEGORY_NAME_SHORTER: "El nombre de la categoría es demasiado corto. Usa uno mas largo.",
	CATEGORY_NAME_LONGER: "El nombre de la categoría es demasiado largo. Usa uno mas corto.",
	CATEGORY_ALREADY_EXIST: "La categoría ya existe.",
	CATEGORY_NOT_CREATED: "No se ha podido crear la categoría.",
	CATEGORY_NOT_UPDATED: "No se ha podido modificar la categoría.",
	CATEGORY_NOT_DELETED: "No se ha podido eliminar la categoría.",
	CATEGORY_NOT_EXIST: "La categoría no existe.",
	// INTOLERANCE
	INTOLERANCE_ID_NOT_DEFINED: "El id de la intolerancia es necesario.",
	INTOLERANCE_ID_NOT_VALID: "La intolerancia no es válida.",
	INTOLERANCE_NAME_NOT_DEFINED: "El nombre de la intolerancia es necesario.",
	INTOLERANCE_NAME_NOT_VALID: "El nombre de la intolerancia no es válido. Prueba con uno nuevo.",
	INTOLERANCE_NAME_SHORTER: "El nombre de la intolerancia es demasiado corto. Usa uno mas largo.",
	INTOLERANCE_NAME_LONGER: "El nombre de la intolerancia es demasiado largo. Usa uno mas corto.",
	INTOLERANCE_ALREADY_EXIST: "La intolerancia ya existe.",
	INTOLERANCE_NOT_CREATED: "No se ha podido crear la intolerancia.",
	INTOLERANCE_NOT_UPDATED: "No se ha podido modificar la intolerancia.",
	INTOLERANCE_NOT_DELETED: "No se ha podido eliminar la intolerancia.",
	INTOLERANCE_NOT_EXIST: "No existe esa intolerancia.",
	// DISH
	DISH_ID_NOT_DEFINED: "El id del plato es necesario",
	DISH_ID_NOT_VALID: "El id del plato no es válido.",
	DISH_NAME_NOT_DEFINED: "El nombre del plato es necesario",
	DISH_NAME_NOT_VALID: "El nombre del plato no es válido.",
	DISH_NAME_SHORTER: "El nombre del plato es demasiado corto. Prueba con uno mas largo.",
	DISH_NAME_LONGER: "El nombre del plato es demasiado largo. Prueba con uno mas corto.",
	DISH_DESCRIPTION_NOT_DEFINED: "La descripción del plato es necesaria",
	DISH_DESCRIPTION_NOT_VALID: "La descripción no es válida.",
	DISH_DESCRIPTION_SHORTER: "La descripción es demasiado corta. Prueba con una mas larga.",
	DISH_DESCRIPTION_LONGER: "La descripción es demasiado larga. Prueba con una mas corta.",
	DISH_PRICE_NOT_DEFINED: "El precio del plato es necesario",
	DISH_PRICE_NOT_VALID: "El precio del plato no es válido",
	DISH_INTOLERANCE_FORMAT_NOT_VALID: "Hay un problema con las intolerancias.",
	DISH_CATEGORY_NOT_DEFINED: "La categoría del plato es necesaria",
	DISH_CATEGORY_NOT_VALID: "La categoría no es válida.",
	DISH_NOT_CREATED: "No se ha podido crear el plato",
	DISH_NOT_UPDATED: "No se ha podido modificar el plato",
	DISH_NOT_DELETED: "No se ha podido eliminar el plato",
	DISH_NOT_EXIST: "El plato no existe",
	// SCHEDULE
	SCHEDULE_ID_NOT_VALID: "El horario no es válido.",
	SCHEDULE_NAME_NOT_DEFINED: "El nombre de la franja horaria es necesario",
	SCHEDULE_NAME_NOT_VALID: "El nombre de la franja horaria no es válido",
	SCHEDULE_NAME_IS_SHORTER: "El nombre de la franja horaria es demasiado corto. Usa uno mas largo.",
	SCHEDULE_NAME_IS_LONGER: "El nombre de la franja horaria es demasiado largo. Usa uno mas corto.",
	SCHEDULE_TIME_NOT_DEFINED: "Es necesario definir la franja horaria.",
	SCHEDULE_TIME_NOT_VALID: "La franja horaria definida no es válida.",
	SCHEDULE_ALREADY_EXIST: "Ya existe una franja horaria definida con ese nombre",
	SCHEDULE_NOT_EXIST: "No existe ninguna franja horaria disponible",
	SCHEDULE_TIME_NOT_VALID: "El horario no existe.",
	// MENU
	MENU_ID_NOT_DEFINED: "El id del menú es necesario",
	MENU_ID_NOT_VALID: "El id del menú no es válido",
	MENU_DATE_NOT_DEFINED: "Es necesario introducir una fecha",
	MENU_DATE_NOT_VALID: "La fecha introducida no es válida.",
	MENU_DISH_NOT_DEFINED: "Hay algún plato que no está correctamente definido",
	MENU_QUANTITY_NOT_DEFINED: "Algún plato no tiene definida la cantidad disponible",
	MENU_DISH_NOT_DELETED: "Un usuario ha reservado en el día de hoy ese plato",
	MENU_IS_EMPTY: "No hay platos para el día seleccionado",
	MENU_DISH_NOT_EXIST: "El plato no existe",
	MENU_NOT_DELETED: "No se ha podido eliminar el menú para la fecha proporcionada",
	MENU_NOT_VALID: "El menú no es válido.",
	// ORDER
	ORDER_NOT_EXIST: "No hay ningún pedido para el día seleccionado",
	ORDER_IS_EMPTY: "No hay pedidos para la fecha seleccionada",
	ORDER_NOT_DELETED: "No se ha podido borrar el pedido",
	ORDER_NOT_ENOUGH_QUANTITY: "Alguno de tus platos excede la cantidad disponible",
	// FEEDBACK
	FEEDBACK_EMPTY: "Hay un problema enviando el feedback.",
	FEEDBACK_LONGER: "¿Podrías detallar algo mas qué te parece nuestra aplicación?",
	FEEDBACK_SHORTER: "Nos has facilitado mucho feedback! ¿Podrías ser un poco mas breve?",
	// FILE
	FILE_FORMAT_NOT_VALID: "El formato de la imagen no es válido",
	FILE_NOT_EXIST: "Ha habido un problema subiendo la imagen",
	FILE_ERROR_READ: "Ha habido un problema con la lectura de la imagen",
	FILE_ERROR_RESIZE: "Ha habido un problema redimensionando la imagen",
	// AWS
	PROBLEM_SENDING_FILE: "Ha habido un problema con el envío del email de confirmación.",
	PROBLEM_UPLOADING_IMAGE: "Ha habido un problema subiendo la imagen solicitada",
	PROBLEM_REMOVING_IMAGE: "Ha habido un problema borrando la imagen del servidor",
};

module.exports = lang;