export const token = "gMIqLeAHRuvino9uuWyIBqEgZlwGrS0peYsQa6dm";
export const apiBaseurl = "https://www.yuque.com/api/v2";
export const baseurl = "//www.yuque.com";
export const namespace = "muspi_merol/blog";
export const headers = { "X-Auth-Token": token };

export function getRateLimitInfo(headers) {
  return {
    limit: headers.get("x-ratelimit-limit"),
    remaining: headers.get("x-ratelimit-remaining"),
  };
}
