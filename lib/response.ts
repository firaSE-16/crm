export const successResponse = (data: any, message = "Success") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message = "Something went wrong") => ({
  success: false,
  message,
});