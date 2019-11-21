"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
};
exports.createResponse = async (promise, options) => {
    const successCode = (options && options.successCode) || 200;
    try {
        const result = await promise;
        log_1.log.info({ result }, 'Result received');
        return {
            statusCode: successCode,
            body: JSON.stringify(result || {}),
            headers
        };
    }
    catch (err) {
        log_1.log.error({ err }, 'Request implementation failed');
        return {
            statusCode: 500,
            body: JSON.stringify({ ok: false }),
            headers
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcmVzcG9uc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBNEI7QUFFNUIsTUFBTSxPQUFPLEdBQUc7SUFDZiw2QkFBNkIsRUFBRSxHQUFHO0lBQ2xDLGtDQUFrQyxFQUFFLElBQUk7Q0FDeEMsQ0FBQztBQUVXLFFBQUEsY0FBYyxHQUFHLEtBQUssRUFBRSxPQUFZLEVBQUUsT0FBYSxFQUFFLEVBQUU7SUFDbkUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQztJQUM1RCxJQUFJO1FBQ0gsTUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUM7UUFDN0IsU0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFeEMsT0FBTztZQUNOLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7WUFDbEMsT0FBTztTQUNQLENBQUM7S0FDRjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ2IsU0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLCtCQUErQixDQUFDLENBQUM7UUFDcEQsT0FBTztZQUNOLFVBQVUsRUFBRSxHQUFHO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUM7WUFDbkMsT0FBTztTQUNQLENBQUM7S0FDRjtBQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGxvZyB9IGZyb20gJy4vbG9nJztcblxuY29uc3QgaGVhZGVycyA9IHtcblx0J0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcblx0J0FjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogdHJ1ZVxufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlc3BvbnNlID0gYXN5bmMgKHByb21pc2U6IGFueSwgb3B0aW9ucz86IGFueSkgPT4ge1xuXHRjb25zdCBzdWNjZXNzQ29kZSA9IChvcHRpb25zICYmIG9wdGlvbnMuc3VjY2Vzc0NvZGUpIHx8IDIwMDtcblx0dHJ5IHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9taXNlO1xuXHRcdGxvZy5pbmZvKHsgcmVzdWx0IH0sICdSZXN1bHQgcmVjZWl2ZWQnKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdGF0dXNDb2RlOiBzdWNjZXNzQ29kZSxcblx0XHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KHJlc3VsdCB8fCB7fSksXG5cdFx0XHRoZWFkZXJzXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0bG9nLmVycm9yKHsgZXJyIH0sICdSZXF1ZXN0IGltcGxlbWVudGF0aW9uIGZhaWxlZCcpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdGF0dXNDb2RlOiA1MDAsXG5cdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeSh7IG9rOiBmYWxzZSB9KSxcblx0XHRcdGhlYWRlcnNcblx0XHR9O1xuXHR9XG59O1xuIl19