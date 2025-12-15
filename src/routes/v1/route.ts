import Elysia from "elysia";
import redirect from "./redirect";

export const route = new Elysia({ prefix: "/v1" }).use(redirect);

export default route;
