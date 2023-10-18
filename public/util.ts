type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

const operations: operation[] = [
  {
    name: "Get Session User (logged in user)",
    endpoint: "/api/session",
    method: "GET",
    fields: {},
  },
  {
    name: "Create User",
    endpoint: "/api/users",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Login",
    endpoint: "/api/login",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Logout",
    endpoint: "/api/logout",
    method: "POST",
    fields: {},
  },
  {
    name: "Update User",
    endpoint: "/api/users",
    method: "PATCH",
    fields: { update: { username: "input", password: "input" } },
  },
  {
    name: "Delete User",
    endpoint: "/api/users",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Users (empty for all)",
    endpoint: "/api/users/:username",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Get Posts (empty for all)",
    endpoint: "/api/posts",
    method: "GET",
    fields: { author: "input" },
  },
  {
    name: "Create Post",
    endpoint: "/api/posts",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Post",
    endpoint: "/api/posts/:id",
    method: "PATCH",
    fields: { id: "input", update: { content: "input", options: { backgroundColor: "input" } } },
  },
  {
    name: "Delete Post",
    endpoint: "/api/posts/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Get Gathering (empty for all)",
    endpoint: "/api/groups",
    method: "GET",
    fields: { id: "input", members: "input" },
  },
  {
    name: "Create Group",
    endpoint: "/api/groups",
    method: "POST",
    fields: { members: "input" },
  },
  {
    name: "Update Group",
    endpoint: "/api/groups/:id",
    method: "PATCH",
    fields: { id: "input", update: { members: "input" } },
  },
  {
    name: "Delete Group",
    endpoint: "/api/groups/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Get Messages (empty for all)",
    endpoint: "/api/messages",
    method: "GET",
    fields: { id: "input", author: "input" },
  },
  {
    name: "Create Message",
    endpoint: "/api/messages",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Message",
    endpoint: "/api/messages/:id",
    method: "PATCH",
    fields: { id: "input", update: { content: "input" } },
  },
  {
    name: "Delete Message",
    endpoint: "/api/messages/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  // Gatherings
  {
    name: "Get Gatherings (empty for all)",
    endpoint: "/api/gatherings",
    method: "GET",
    fields: { id: "input", query: { name: "input", members: "input", groups: "input", activity: "input" } },
  },
  {
    name: "Create Gathering",
    endpoint: "/api/gatherings",
    method: "POST",
    fields: { params: { name: "input", members: "input", groups: "input", activity: "input" } },
  },
  {
    name: "Update Gathering",
    endpoint: "/api/gatherings/:id",
    method: "PATCH",
    fields: { id: "input", params: { name: "input", members: "input", groups: "input", activity: "input" } },
  },
  {
    name: "Delete Gathering",
    endpoint: "/api/gatherings/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  // Locations
  {
    name: "Get Locations (empty for all)",
    endpoint: "/api/locations",
    method: "GET",
    fields: { coordinates: { longitude: "input", latitude: "input" } },
  },
  {
    name: "Get Nearby Locations",
    endpoint: "/api/location/:id",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Create Location",
    endpoint: "/api/locations",
    method: "POST",
    fields: { coordinates: { longitude: "input", latitude: "input" } },
  },
  {
    name: "Update Location",
    endpoint: "/api/locations/:id",
    method: "PATCH",
    fields: { id: "input", update: { coordinates: { longitude: "input", latitude: "input" } } },
  },
  {
    name: "Delete Location",
    endpoint: "/api/locations/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  // Activities
  {
    name: "Get Activities (empty for all)",
    endpoint: "/api/activities",
    method: "GET",
    fields: { query: { name: "input", description: "input", location: "input", date: "input" } },
  },
  {
    name: "Create Activity",
    endpoint: "/api/activities",
    method: "POST",
    fields: { params: { name: "input", description: "input", location: "input", date: "input" } },
  },
  {
    name: "Update Activity",
    endpoint: "/api/activities/:id",
    method: "PATCH",
    fields: { id: "input", update: { name: "input", description: "input", location: "input", date: "input" } },
  },
  {
    name: "Delete Activity",
    endpoint: "/api/activities/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  // Chatrooms
  {
    name: "Get Chatrooms (empty for all)",
    endpoint: "/api/chatrooms",
    method: "GET",
    fields: { coordinates: { longitude: "input", latitude: "input" } },
  },
  {
    name: "Create Chatroom",
    endpoint: "/api/chatrooms",
    method: "POST",
    fields: { coordinates: { longitude: "input", latitude: "input" } },
  },
  {
    name: "Update Chatroom",
    endpoint: "/api/chatrooms/:id",
    method: "PATCH",
    fields: { id: "input", update: { coordinates: { longitude: "input", latitude: "input" } } },
  },
  {
    name: "Delete Chatroom",
    endpoint: "/api/chatrooms/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  // Messages
  {
    name: "Get Activities (empty for all)",
    endpoint: "/api/messages",
    method: "GET",
    fields: { query: { name: "input", description: "input", location: "input", date: "input" } },
  },
  {
    name: "Create Message",
    endpoint: "/api/messages",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Message",
    endpoint: "/api/messages/:id",
    method: "PATCH",
    fields: { id: "input", content: "input" },
  },
  {
    name: "Delete Message",
    endpoint: "/api/messages/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
];

// Do not edit below here.
// If you are interested in how this works, feel free to ask on forum!

function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
      params = undefined;
    }

    const res = fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: params ? JSON.stringify(params) : undefined,
    });

    return {
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
  return Object.entries(fields)
    .map(([name, tag]) => {
      return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${tag} name="${prefix}${name}"></${tag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
    .join("");
}

function getHtmlOperations() {
  return operations.map((operation) => {
    return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
  });
}

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (!value) {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
    let currentObj = obj;
    for (const key of keys) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[lastKey] = value;
  }
  return obj;
}

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
    delete reqData[key];
    return param;
  });

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
