"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController = __importStar(require("../controllers/UserController"));
const MessageController = __importStar(require("../controllers/MessagingController"));
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const router = express_1.default.Router();
//Default route
router.get("/", (req, res) => {
    res.render("index");
});
//Onboard/offboard Routes
router.post("/signup", UserController.create_user_post);
router.post("/login", UserController.login_user_post);
router.post("/logout", requireAuth_1.default, UserController.logout_user_post);
//User Routes
router.post("/updatestatus", requireAuth_1.default, UserController.update_user_status_post);
router.get("/users", requireAuth_1.default, UserController.get_all_users);
router.get("/user/:id", requireAuth_1.default, UserController.get_single_user);
//Friend Routes
router.post("/addfriend", requireAuth_1.default, UserController.add_friend);
router.post("/removefriend", requireAuth_1.default, UserController.remove_friend);
router.get("/friends", requireAuth_1.default, UserController.get_all_friends);
//Message Routes
router.get("/conversations", requireAuth_1.default, MessageController.get_conversations);
router.post("/createconversation", requireAuth_1.default, MessageController.create_conversation);
router.put("/leaveconversation", requireAuth_1.default, MessageController.leave_conversation);
router.put("/editconversationtitle", requireAuth_1.default, MessageController.edit_conversation_title);
router.post("/createmessage", requireAuth_1.default, MessageController.create_message);
exports.default = router;
//# sourceMappingURL=router.js.map