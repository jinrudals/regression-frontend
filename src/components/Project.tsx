import { ProjectProp } from "@/types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
} from "@nextui-org/react";

export function Project({ data: { id, name, url } }: { data: ProjectProp }) {
  const answer = (
    <Link href={`/dv/regression/project/${id}`}>
      <Card className="min-w-[400px]">
        <CardHeader className="flex gap-3"> {id} </CardHeader>
        <Divider />
        <CardBody>
          <p> {name} </p>
        </CardBody>
        <Divider />
        <CardFooter>
          <p> {url} </p>
        </CardFooter>
      </Card>
    </Link>
  );

  return answer;
}
