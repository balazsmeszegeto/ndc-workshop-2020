import { connect as hubWorkerConnect, invoke as hubWorkerInvoke, stop as hubWorkerStop} from "./hub-worker";

const cache = new Map();
export async function invoke(method, args) {
    if (method !== 'GetRestaurant')
        return await hubWorkerInvoke(method, ...args);

    const restaurantId = args[0];

    if (cache.has(restaurantId))
        return cache.get(restaurantId);

    const result = await hubWorkerInvoke('GetRestaurant', [restaurantId]);
    cache.set(restaurantId, result);
    return result;
}

export function connect(endpoint, accessToken, eventsToHandle) {
    return hubWorkerConnect(endpoint, accessToken, eventsToHandle);
}

export function stop() {
    return hubWorkerStop();
}