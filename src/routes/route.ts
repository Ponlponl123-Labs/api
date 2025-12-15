import Elysia from "elysia";
import v1 from "./v1/route";

export const route = new Elysia().use(v1);

export default route;
