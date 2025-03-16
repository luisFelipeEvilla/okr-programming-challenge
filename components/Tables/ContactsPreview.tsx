import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import { ContactSchema } from "@/lib/schemas";

export default function ContactsPreview({ contacts }: { contacts: ContactSchema[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={`${contact.first_name}-${contact.last_name}-${contact.email_address.address}-${contact.phone_numbers?.[0]?.phone_number}`}>
                <TableCell>{contact.first_name}</TableCell>
                <TableCell>{contact.last_name}</TableCell>
                <TableCell>{contact.email_address.address}</TableCell>
                <TableCell>{contact.street_addresses?.[0]?.street}</TableCell>
                <TableCell>{contact.phone_numbers?.[0]?.phone_number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
