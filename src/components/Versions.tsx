import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { VersionType } from "@/types";

export default function Version({
  data: { id, name, project },
}: {
  data: VersionType;
}) {
  return (
    <Link href={`/dv/regression/project/${project}/version/${name}`}>
      <Card className="min-w-[400px]">
        {/* <CardHeader> {name} </CardHeader> */}
        <CardBody>
          <p> {name} </p>
        </CardBody>
      </Card>
    </Link>
  );
}
