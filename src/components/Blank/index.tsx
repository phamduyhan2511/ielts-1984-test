import clsx from "clsx";
import React, { memo } from "react";
import { Droppable } from "react-beautiful-dnd";
import styles from "./styles.module.scss";

interface BlankProps {
  id: number;
  type: "input" | "drag";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickValue: (id: number)=> void
}

const Blank: React.FC<BlankProps> = ({ id, type, value, onChange, onClickValue = ()=> {} }) => {
  return (
    <Droppable droppableId={`blank-${id}`} key={id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={clsx(styles.blankDrop)}
        >
          <div
            className={clsx({
              [styles.filled]:type !== "input" && !!value,
              '!w-full': type === "input"
            })}
          >
            {type === "input" ? (
              <input
                type="text"
                id={`blank-${id}`}
                value={value}
                onChange={onChange}
                className={styles.blankInput}
              />
            ) : (
              <span onClick={()=>onClickValue(id)} className={clsx({ [styles.filled]: value })}>{value}</span>
            )}
          </div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Blank;
