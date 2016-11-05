// Current Database type
var DB = "MySQL";

var dbFormats = {
	MySQL: {
		date: "YYYY-MM-DD",
		time: "HH:mm:ss",
		dateTime: "YYYY-MM-DD HH:mm:ss"
	}
};

var DateFormat = {
	db: dbFormats[DB]
};

export default DateFormat;