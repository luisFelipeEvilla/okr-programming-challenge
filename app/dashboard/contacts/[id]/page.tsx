import { getContact } from "@/services/constantContact.service";
import { ContactSchema } from "@/schemas/Contact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

interface ContactDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContactDetailsPage({
  params,
}: ContactDetailsProps) {
  const { id } = await params;

  const contact = await getContact(id);

  if (!contact) {
    return (
      <div className="container mx-auto py-10">
        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="text-muted-foreground">Contact not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/contacts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Contact Details</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <span>
                {contact.first_name} {contact.last_name}
              </span>
              <Badge variant="outline">{contact.contact_id}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Email Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="font-medium">Email Address</span>
              </div>
              <div className="pl-6">
                <div className="flex items-center gap-2">
                  <span>{contact.email_address.address}</span>
                  <Badge variant="secondary">
                    {contact.email_address.permission_to_send}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Phone Numbers Section */}
            {contact.phone_numbers && contact.phone_numbers.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">Phone Numbers</span>
                </div>
                <div className="pl-6 space-y-3">
                  {contact.phone_numbers.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>{phone.phone_number}</span>
                      <Badge>{phone.kind}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Addresses Section */}
            {contact.street_addresses &&
              contact.street_addresses.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Addresses</span>
                  </div>
                  <div className="pl-6 space-y-4">
                    {contact.street_addresses.map((address, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge>{address.kind}</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state}{" "}
                            {address.postal_code}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Created At */}
            <Separator />
            <div className="text-sm text-muted-foreground">
              Created at:{" "}
              {contact.created_at
                ? new Date(contact.created_at).toLocaleString()
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
