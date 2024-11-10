"use client";

import parse from "html-react-parser"; // Import html-react-parser
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import Blank from "../Blank"; // Import your Blank component
import styles from "./styles.module.scss";
import clsx from "clsx";

// Component to handle paragraph and drag/drop functionality
const DragDropParagraph: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});

  const [wordsSelected, setWordsSelected] = useState([]);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
  }>(null);

  // Load data from JSON
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json: { question: any }) => setData(json.question));
  }, []);

  // Handle the drag-and-drop event
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const blankId = parseInt(destination.droppableId.replace("blank-", ""));
    const word = data?.dragWords.find((w) => w.id === parseInt(draggableId));

    if (word && blankId) {
      setAnswers((prev) => ({ ...prev, [blankId]: word }));
      setWordsSelected((prev) => [
        ...prev.filter((id) => id !== answers[blankId]?.id),
        word.id,
      ]);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    blankId: number
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [blankId]: { word: event.target.value },
    }));
  };

  const handleRemoveSelect = (blankId) => {
    const selectedWord = answers?.[blankId]?.word;
    const word = data.dragWords.find((i) => i.word === selectedWord);
    if (word) {
      setAnswers((prev) => ({ ...prev, [blankId]: "" }));
      setWordsSelected((prev) => prev.filter((i) => i !== word.id));
    }
  };

  const handleSubmit = () => {
    if (data) {
      const isCorrect = data.blanks.every(
        (blank: any) => answers[blank.id]?.word === blank.correctAnswer
      );
      setFeedback(
        isCorrect
          ? { isCorrect, message: "Chính xác!" }
          : { isCorrect, message: "Sai, hãy thử lại" }
      );
    }
  };

  // Function to parse and render the paragraph with placeholders
  const renderParagraph = () => {
    if (!data) return null;
    let blankNumber = 0;

    // Parse the paragraph using html-react-parser
    const parsedHTML = parse(data.paragraph, {
      replace: (node: any, index: number) => {
        if (node.type === "text" && node.data.includes("[_input]")) {
          const parts = node.data.split("[_input]");

          // Return a fragment wrapping each text part and <input /> component
          return (
            <>
              {parts.map((part, index) => {
                const blankItem = data.blanks[blankNumber];

                if (index < parts.length - 1) {
                  blankNumber++;
                  return (
                    <React.Fragment key={blankItem.id}>
                      {part}
                      <Blank
                        id={blankItem.id}
                        type={blankItem.type}
                        value={answers[blankItem.id]?.word || ""}
                        onChange={(e) => handleInputChange(e, blankItem.id)}
                        onClickValue={handleRemoveSelect}
                      />
                    </React.Fragment>
                  );
                }
                return <React.Fragment key={part}>{part}</React.Fragment>;
              })}
            </>
          );
        }
        return node;
      },
    } as any);

    return parsedHTML;
  };

  return (
    <div className={styles.container}>
      {data && (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="p-2 text-left">{renderParagraph()}</div>
            <Droppable droppableId="droppable-words">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.words}
                >
                  {data.dragWords
                    .filter((i) => !wordsSelected.includes(i.id))
                    .map((word, index) => {
                      return (
                        <Draggable
                          key={word.id.toString()}
                          draggableId={word.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                              className={clsx(styles.word, {
                                "text-red-600": word.color === "red",
                                "text-black": word.color === "black",
                                "text-gray-800":
                                  word.color !== "red" &&
                                  word.color !== "black",
                              })}
                            >
                              {word.word}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="mt-8 flex flex-col gap-2">
            <div>
              <button
                onClick={handleSubmit}
                className="h-8 w-24 text-white bg-blue-500 rounded-lg"
              >
                Submit
              </button>
            </div>
            {feedback && (
              <p
                className={
                  feedback.isCorrect ? "text-green-500" : "text-red-500"
                }
              >
                {feedback.message}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DragDropParagraph;
