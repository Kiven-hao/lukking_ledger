import { fail, ok } from "@/lib/utils/api";

export async function POST() {
  return fail("WeChat auth integration requires live credentials and admin flow setup.", 501);
}
