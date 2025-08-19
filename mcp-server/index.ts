import { Agentica } from '@agentica/core';
import OpenAI from 'openai';
import typia from "typia";
import * as dotenv from "dotenv";
import { HwpController } from './hwp/HwpController';
import { ExcelController } from './excel/ExcelController';
import { FileSystemController } from './controllers/fileSystem';

dotenv.config();

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY가 설정되지 않았습니다. .env 파일 확인 필요");
}

const agent = new Agentica({
  model:'gemini',
  vendor: {
    api: new OpenAI({ apiKey: apiKey }),
    model: 'gemini-2.5-flash-lite',
  },
  controllers: [
    typia.llm.controller<FileSystemController, "gemini">(
      "filesystem",
      new FileSystemController('C:/')
    ),
    typia.llm.controller<HwpController, "gemini">(
    "hwp",
    new HwpController()
    ),
    typia.llm.controller<ExcelController, "gemini">(
      "excel",
      new ExcelController()
    )
  ],
});

console.log("Agentica 객체 생성 완료:", agent);