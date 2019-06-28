const express = require("express");
const server = express();

server.use(express.json());

server.use((req, res, next) => {
  console.time('Request');
  console.count('Request called');
  next();
  console.timeEnd('Request');
});

const projects = [{ id: "1", title: "Novo Projeto", tasks: [] }];

function checkProjectId(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }

  return next();
}

function checkProject(req, res, next) {
  const { id, title, tasks } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (!tasks) {
    return res.status(400).json({ error: "Tasks is required" });
  }

  return next();
}

function checkProjectInArray(req, res, next) {
  const { id } = req.params;

  const projectFound = projects.find(project => project.id == id);

  if (!projectFound) {
    return res.status(400).json({ error: "Project not found" });
  }

  req.projectFound = projectFound;

  return next();
}

function checkIfProjectAlrearyExists(req, res, next) {
  const { id } = req.body;

  const projectFound = projects.find(project => project.id == id);

  if (projectFound) {
    return res.status(400).json({ error: "Project already exists" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post(
  "/projects",
  checkProject,
  checkIfProjectAlrearyExists,
  (req, res) => {
    const project = req.body;

    projects.push(project);

    return res.json(projects);
  }
);

server.post(
  "/projects/:id/tasks",
  checkProjectId,
  checkProjectInArray,
  (req, res) => {
    const { taskTitle } = req.body;
    const { id } = req.params;

    projects.map(project => {
      if (id === project.id) {
        project.tasks.push(taskTitle);
      }
    });

    return res.json(projects);
  }
);

server.put("/projects/:id", checkProjectId, checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(projectForUpdate => {
    if (projectForUpdate.id === id) {
      projectForUpdate.title = title;
    }
  });

  return res.json(projects);
});

server.delete(
  "/projects/:id",
  checkProjectId,
  checkProjectInArray,
  (req, res) => {
    const { id } = req.params;
    const { projectFound } = req;

    projects.splice(projectFound, 1);

    return res.send();
  }
);

server.listen(3000);
