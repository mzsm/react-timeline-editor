import { DraggableOptions } from "@interactjs/actions/drag/plugin";
import { ResizableOptions } from "@interactjs/actions/resize/plugin";
import { DragEvent, Interactable } from "@interactjs/types";
import interact from "interactjs";
import { cloneElement, FC, ReactElement, useEffect, useRef } from "react";

export const InteractComp: FC<{
  interactRef?: React.MutableRefObject<Interactable>;
  draggable: boolean;
  draggableOptions: DraggableOptions;
  children: ReactElement
}> = ({ children, interactRef, draggable, draggableOptions }) => {
  const nodeRef = useRef<HTMLElement>();
  const interactable = useRef<Interactable>();
  const draggableOptionsRef = useRef<DraggableOptions>();

  useEffect(() => {
    draggableOptionsRef.current = { ...draggableOptions };
  }, [draggableOptions]);

  useEffect(() => {
    interactable.current && interactable.current.unset();
    interactable.current = interact(nodeRef.current);
    interactRef.current = interactable.current;
    setInteractions();
  }, [draggable]);

  const setInteractions = () => {
    if (draggable)
      interactable.current.draggable({
        ...draggableOptionsRef.current,
        onstart: (e) => draggableOptionsRef.current.onstart && (draggableOptionsRef.current.onstart as (e: DragEvent) => any)(e),
        onmove: (e) => draggableOptionsRef.current.onmove && (draggableOptionsRef.current.onmove as (e: DragEvent) => any)(e),
        onend: (e) => draggableOptionsRef.current.onend && (draggableOptionsRef.current.onend as (e: DragEvent) => any)(e),
      });
  };

  return cloneElement(children as ReactElement, {
    ref: nodeRef,
    draggable: false,
  });
};
