'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Send, Search, MoreVertical, Phone, Video, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function MessagesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      try {
        const res = await api.get('/messages/contacts');
        if (res.data.success) {
          setContacts(res.data.data);
          if (res.data.data.length > 0) {
            setActiveContact(res.data.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!authLoading) {
      fetchContacts();
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeContact) return;
      try {
        const res = await api.get(`/messages/${activeContact.id}`);
        if (res.data.success) {
          setMessages(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [activeContact]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeContact) return;
    try {
      const res = await api.post('/messages', {
        receiverId: activeContact.id,
        text: newMessage
      });
      if (res.data.success) {
        setMessages([...messages, res.data.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted mt-1">Communicate with your service providers.</p>
      </div>

      <Card className="flex-1 overflow-hidden flex border-muted">
        {/* Contacts Sidebar */}
        <div className="w-1/3 border-r flex flex-col bg-muted/10">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                onClick={() => setActiveContact(contact)}
                className={`flex items-center p-4 cursor-pointer hover:bg-muted/30 transition-colors ${activeContact?.id === contact.id ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                    {contact.image ? (
                      <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" />
                    ) : (
                      contact.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(contact.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className={`text-sm truncate ${contact.unread > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {contact.lastMessage}
                    </p>
                    {contact.unread > 0 && (
                      <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {contacts.length === 0 && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No contacts found.
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="w-2/3 flex flex-col bg-background relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
          
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b flex justify-between items-center bg-background/95 backdrop-blur-sm z-10">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3 overflow-hidden">
                    {activeContact.image ? (
                      <img src={activeContact.image} alt={activeContact.name} className="w-full h-full object-cover" />
                    ) : (
                      activeContact.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">{activeContact.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                      Online
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
                {messages.map((msg) => {
                  const isMe = msg.sender === user?._id;
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        isMe 
                          ? 'bg-primary text-primary-foreground rounded-br-sm' 
                          : 'bg-muted rounded-bl-sm'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-background z-10">
                <div className="flex items-end space-x-2 bg-muted/30 rounded-xl p-2 border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1 bg-transparent border-0 focus:ring-0 resize-none max-h-32 min-h-[40px] py-2 px-2 text-sm" 
                    placeholder="Type your message..."
                    rows={1}
                  />
                  <Button onClick={sendMessage} size="icon" className="rounded-full h-10 w-10 shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a contact to start messaging</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
