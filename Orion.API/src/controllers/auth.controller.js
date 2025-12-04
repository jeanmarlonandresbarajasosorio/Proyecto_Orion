import AuthService from "../services/auth.service.js";

export const register = (req, res) => AuthService.register(req, res);
export const login = (req, res) => AuthService.login(req, res);
export const resetPassword = (req, res) => AuthService.resetPassword(req, res);
export const changePassword = (req, res) => AuthService.changePassword(req, res);
