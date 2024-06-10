import React, { useState } from "react";
import "./style.scss";
import { taskAtom } from "@/stores/index";
import { useAtom } from "jotai";

const tasks = [
  { id: 1000, name: "계좌 조회" },
  { id: 1001, name: "자유입출금 예금 업무" },
  { id: 1002, name: "예금 업무" },
  { id: 1004, name: "적금 업무" },
  { id: 1006, name: "계좌 제신고" },
  { id: 1007, name: "전자금융" },
  { id: 1008, name: "체크카드 상담" },
  { id: 1009, name: "신용카드 상담" },
  { id: 1010, name: "대출 상담" },
  { id: 1011, name: "펀드 상담" },
  { id: 1012, name: "방카슈랑스 상담" }
];

function TaskList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setTaskId] = useAtom(taskAtom);

  const filteredTasks = tasks.filter(
    (task) =>
      task.name.includes(searchTerm) || task.id.toString().includes(searchTerm)
  );

  return (
    <div className="task-list">
      <input
        type="text"
        placeholder="업무 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="task-search"
      />
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} onClick={() => setTaskId(task.id)}>
            {task.name} ({task.id})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
