
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { classifyAndAddIncident } from '@/lib/actions';
import { useStore } from '@/lib/store';
import { fileToDataUri } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Image as ImageIcon, AlertCircle } from 'lucide-react';

export function IncidentSheet() {
  const { 
    isOpen, 
    mode, 
    incident, 
    location, 
    closeSheet, 
    addIncident, 
    clearNewIncidentLocation 
  } = useStore(state => ({
    isOpen: state.activeSheet !== null,
    mode: state.activeSheet,
    incident: state.selectedIncident,
    location: state.newIncidentLocation,
    closeSheet: state.closeSheet,
    addIncident: state.addIncident,
    clearNewIncidentLocation: state.clearNewIncidentLocation,
  }));

  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset form when the sheet is closed or mode changes
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      fileToDataUri(file).then(setPhotoPreview);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!location || !description || !photo) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide location, description, and a photo.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const photoDataUri = await fileToDataUri(photo);
      const result = await classifyAndAddIncident({ description, photoDataUri, location });

      if (result.success && result.data) {
        addIncident(result.data); // This will also close the sheet
        toast({
          title: 'Incident Reported',
          description: 'Thank you for contributing to community safety.',
        });
        resetForm(); // Explicitly reset form state after successful submission
      } else {
        throw new Error(result.error || 'Failed to report incident.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'An unknown error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setPhoto(null);
    setPhotoPreview(null);
    // Don't clear location here, it's handled by the store
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent className="sm:max-w-md w-full flex flex-col">
        {mode === 'details' && incident && (
          <>
            <SheetHeader>
              <SheetTitle className="font-headline">Incident Details</SheetTitle>
              <SheetDescription>
                Reported {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                <Image src={incident.photoUrl} alt={incident.description} fill style={{ objectFit: 'cover' }} data-ai-hint={incident.photoHint} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Description</p>
                <p className="text-muted-foreground">{incident.description}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium">Category:</p>
                <Badge variant="secondary">{incident.category}</Badge>
              </div>
               <div className="flex gap-2 items-center">
                <p className="text-sm font-medium">Severity:</p>
                <Badge variant={incident.severity === 'High' || incident.severity === 'Critical' ? 'destructive' : 'default'}>{incident.severity}</Badge>
              </div>
              {incident.requiresHumanReview && (
                <div className="flex gap-2 items-center text-destructive">
                   <AlertCircle className="w-4 h-4" />
                   <p className="text-sm font-medium">Flagged for Human Review</p>
                </div>
              )}
            </div>
          </>
        )}
        {mode === 'report' && (
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle className="font-headline">Report a New Incident</SheetTitle>
              <SheetDescription>
                Help keep your community safe by reporting incidents.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 py-4 space-y-4 overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                {location ? (
                  <div className="flex items-center justify-between p-2 text-sm rounded-md border bg-muted">
                    <span className="text-muted-foreground">
                      Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                    </span>
                    <Button type="button" variant="ghost" size="sm" onClick={clearNewIncidentLocation}>Change</Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center rounded-md border-2 border-dashed">
                    <MapPin className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click on the map to set incident location.</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you saw..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="h-28"
                  disabled={!location}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo Evidence</Label>
                 {photoPreview ? (
                   <div className="relative">
                     <Image src={photoPreview} width={400} height={300} alt="Preview" className="w-full rounded-md object-cover aspect-video" />
                     <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => {setPhoto(null); setPhotoPreview(null)}}>Remove</Button>
                   </div>
                 ) : (
                   <div className="flex items-center justify-center w-full">
                    <Label htmlFor="photo-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted ${!location ? 'cursor-not-allowed opacity-50' : ''}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        </div>
                        <Input id="photo-upload" type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" required disabled={!location} />
                    </Label>
                   </div>
                 )}
              </div>
            </div>
            <SheetFooter>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting || !location || !description || !photo}>
                {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
