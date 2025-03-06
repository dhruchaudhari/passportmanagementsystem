import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error for debugging

    if (err instanceof ApiError) {
        return res.status(err.statuscode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
        });
    }

    // Handle generic errors
    return res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
};

export default errorHandler;
