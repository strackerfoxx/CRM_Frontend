import { Checkbox } from "@/components/ui/checkbox"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"

export default function FieldChoiceCard({services, servicesSelected, setServicesSelected}) {

  const toggle = (value) => {
    setServicesSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }
  return (
    <div className="w-full">
      <FieldGroup>
        <FieldSet className="h-[10rem] border rounded-lg bg-neutral-900 overflow-y-auto gap-3 p-4">
            {services && services.map((service) => (
                <FieldLabel htmlFor={service.id} key={service.id} className="cursor-pointer hover:bg-neutral-800 rounded-md">
                <Field orientation="horizontal" className="items-center gap-3">
                    <Checkbox 
                        id={service.id}
                        checked={servicesSelected.includes(service.id)}
                        onCheckedChange={() => toggle(service.id)}
                    />
                    <FieldContent>
                    <FieldTitle>{service.name}</FieldTitle>
                    <FieldDescription>{service.durationMin} mins - ${service.price}</FieldDescription>
                    </FieldContent>
                </Field>
                </FieldLabel>
            ))}
        </FieldSet>
      </FieldGroup>
    </div>
  )
}