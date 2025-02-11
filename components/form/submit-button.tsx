import Icon from "@/components/ui/icon";

import { Button } from "react-bootstrap";

type SubmitButtonProps = {
  isDirty: boolean;
  isUpdate: boolean;
};

export default function SubmitButton({ isDirty, isUpdate }: SubmitButtonProps) {
  return (
    <Button type="submit" variant="outline-success" disabled={!isDirty}>
      {isUpdate ? (
        <>
          <Icon icon="floppy" />
          save
        </>
      ) : (
        <>
          <Icon icon="plus-circle" />
          add
        </>
      )}
    </Button>
  );
}
