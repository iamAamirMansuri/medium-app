import { Hono } from "hono";

const blogRouter = new Hono();

blogRouter.post("/", (c) => {
  return c.text("Hello Aamir!");
});
blogRouter.put("/", (c) => {
  return c.text("Hello Aamir!");
});
blogRouter.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.text("Hello Aamir! " + id);
});
blogRouter.get("/bulk", (c) => {
  return c.text("Hello Aamir!");
});

export default blogRouter;
