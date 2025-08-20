import { Agentica, assertHttpController } from "@agentica/core";
import OpenAI from "openai";
import typia from "typia";
import { FileSystemController } from "./controllers/fileSystem";
import { ExcelController } from "./excel/ExcelController";
import { HwpController } from "./hwp/HwpController";

async function main() {
  const agent = new Agentica({
    model: "gemini",
    vendor: {
      model: "gemini-2.5-flash-lite",
      api: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    },
    controllers: [
      // 클래스 인스턴스를 생성해서 전달
      typia.llm.controller<FileSystemController, "gemini">(
        "filesystem",
        new FileSystemController("C:/")
      ),
      typia.llm.controller<HwpController, "gemini">("hwp", new HwpController("HwpController.jar")),
      typia.llm.controller<ExcelController, "gemini">(
        "excel",
        new ExcelController("ExcelController.jar")
      ),
    ],
  });

  // AI 대화 호출
  await agent.conversate("내 Documents 폴더 파일 목록 보여줘");
  console.log("Node MCP 서버 + Agentica 실행 완료");
}

main();
