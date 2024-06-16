"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { api as internal } from "@/lib/authenticate/bare";
import { FormEvent, useState, useEffect } from "react";
import { GroupType } from "@/types";

export function TestcaseModal({ project }: { project: number }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState({
    key: "",
    command: "",
    timeout: "",
    status: "todo",
    group: "",
  });
  const [groupOptions, setGroupOptions] = useState<GroupType[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch group data from the server when the modal is opened
      fetchGroupData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function fetchGroupData() {
    try {
      const response = await internal.get(
        `/api/group/project/?project__id__in=${project}`
      ); // Replace with your API endpoint
      const data: GroupType[] = await response.json();
      setGroupOptions(data); // Assuming the response is { groups: ["group1", "group2", ...] }
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!Number.isInteger(Number(formData.timeout))) {
      alert("Timeout must be an integer");
      return;
    }
    try {
      const body = JSON.stringify({ ...formData, project: project });
      const response = await fetch("/lib/server", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: body,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSelectChange(key: string, value: string) {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  }

  return (
    <>
      <div>
        <Button onPress={onOpen}> Add Testcase</Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={true}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader> Add Testcase </ModalHeader>
                <form onSubmit={onSubmit}>
                  <ModalBody>
                    <Input
                      type="text"
                      placeholder="Key"
                      name="key"
                      value={formData.key}
                      onChange={handleInputChange}
                    />
                    <Input
                      type="text"
                      placeholder="Command"
                      name="command"
                      value={formData.command}
                      onChange={handleInputChange}
                    />
                    <Input
                      type="number"
                      placeholder="Timeout"
                      name="timeout"
                      value={formData.timeout}
                      onChange={handleInputChange}
                    />
                    <Select
                      placeholder="Status"
                      value={formData.status}
                      onSelectionChange={(value) =>
                        handleSelectChange("status", value.toString())
                      }
                    >
                      <SelectItem key="todo" value="todo">
                        To Do
                      </SelectItem>
                      <SelectItem key="candidate" value="candidate">
                        Candidate
                      </SelectItem>
                      <SelectItem key="done" value="done">
                        Done
                      </SelectItem>
                    </Select>
                    <Select
                      placeholder="Group"
                      value={formData.group}
                      onSelectionChange={(value) =>
                        handleSelectChange("group", value.toString())
                      }
                    >
                      {groupOptions.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </ModalBody>
                  <ModalFooter>
                    <Button type="submit">Add</Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
