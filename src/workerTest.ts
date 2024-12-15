import { ParametricGrid, PixelReactor, RuleGrid, type Vec2d } from "../PixelReactor"

// This worker code from: https://stackoverflow.com/questions/73862386/how-do-i-compile-web-workers-with-vue3vite
onmessage = (message) => {
    const { type, value } = message.data;
    switch (type?.toLowerCase()) {
        case "connect":
            console.log("CONNECT!", value)
            break;
        case "destroy":
            console.log("DESTROY!")
            break;
    }
}