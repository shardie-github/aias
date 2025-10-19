import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Video, Phone, MessageSquare } from 'lucide-react';

const meetingTypes = [
  { icon: Video, label: 'Video Call', value: 'video' },
  { icon: Phone, label: 'Phone Call', value: 'phone' },
  { icon: MessageSquare, label: 'Chat Only', value: 'chat' },
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

export const BookingInterface = () => {
  const [selectedType, setSelectedType] = useState('video');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-4">
              Schedule Your
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Free Consultation
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground px-4">
              Meet with an AI automation expert to discuss your business needs
            </p>
          </div>

          <div className="p-4 sm:p-6 md:p-8 rounded-xl bg-gradient-card backdrop-blur-sm border border-border">
            <form className="space-y-4 sm:space-y-6">
              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input id="fullName" placeholder="John Doe" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                  <Input id="email" type="email" placeholder="john@company.com" required />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">Company</label>
                  <Input id="company" placeholder="Your Company" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              {/* Meeting Type */}
              <div>
                <label htmlFor="meetingType" className="block text-sm font-medium mb-3">Preferred Meeting Type *</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {meetingTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedType(type.value)}
                      className={`p-3 sm:p-4 rounded-lg border transition-all min-h-[80px] sm:min-h-[100px] ${
                        selectedType === type.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <type.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-primary" />
                      <div className="text-xs sm:text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Select Date *
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Select Time *
                  </label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-background border border-input"
                    required
                  >
                    <option value="">Choose a time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label htmlFor="needs" className="block text-sm font-medium mb-2">
                  Tell us about your automation needs
                </label>
                <Textarea
                  id="needs"
                  placeholder="What business processes would you like to automate? What challenges are you facing?"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full bg-gradient-primary shadow-glow">
                Schedule Consultation
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Note: This is a UI placeholder. Backend booking logic will be implemented by Momen.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
