import { useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';
import { smsConfig } from '../config/sms';

interface ReceivedMessage {
  id: string;
  message: string;
  phoneNumber: string;
  receivedAt: string;
  created: string;
  updated: string;
}

interface SentMessage {
  id: string;
  raw_message: string;
  user: string;
  expand?: {
    user: {
      id: string;
      name: string;
    }
  };
  created: string;
  updated: string;
}

function interpretCommand(rawMessage: string): string {
  const commands = smsConfig.commands;
  
  switch(rawMessage) {
    case commands.turnOn:
      return "Skru varme på";
    case commands.turnOff:
      return "Skru varme av";
    case commands.status:
      return "Status forespørsel";
    case commands.temperatureControlStue:
      return "Temperaturkontroll (Stue)";
    case commands.temperatureControlStue1:
      return "Temperaturkontroll (Stue 1)";
    case commands.temperatureControlStue2:
      return "Temperaturkontroll (Stue 2)";
    case commands.temperatureControlSov:
      return "Temperaturkontroll (Soverom)";
    default:
      return rawMessage;
  }
}

// Format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

export function MessageHistory() {
  const [receivedMessages, setReceivedMessages] = useState<ReceivedMessage[]>([]);
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        const receivedResult = await pb.collection('messages').getList(1, 5, {
          sort: '-created',
        });
        
        const sentResult = await pb.collection('sent_messages').getList(1, 5, {
          sort: '-created',
          expand: 'user',
        });
        
        setReceivedMessages(receivedResult.items as unknown as ReceivedMessage[]);
        setSentMessages(sentResult.items as unknown as SentMessage[]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const unsubscribeReceived = pb.collection('messages').subscribe('*', async ({ action, record }) => {
      if (action === 'create') {
        setReceivedMessages(prev => [record as unknown as ReceivedMessage, ...prev].slice(0, 20));
      }
    });

    const unsubscribeSent = pb.collection('sent_messages').subscribe('*', async ({ action, record }) => {
      if (action === 'create') {
        const expandedRecord = await pb.collection('sent_messages').getOne(record.id, {
          expand: 'user',
        });
        setSentMessages(prev => [expandedRecord as unknown as SentMessage, ...prev].slice(0, 20));
      }
    });

    return () => {
      unsubscribeReceived.then(unsub => unsub());
      unsubscribeSent.then(unsub => unsub());
    };
  }, []);

  if (loading) {
    return <div className="text-center py-4">Laster meldingshistorikk...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Sendte meldinger</h2>
        {sentMessages.length === 0 ? (
          <p className="text-gray-500">Ingen sendte meldinger enda.</p>
        ) : (
          <div className="space-y-4">
            {sentMessages.map((message) => (
              <div key={message.id} className="border-b border-gray-200 pb-3">
                <div className="font-medium text-blue-600">
                  {interpretCommand(message.raw_message)}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Opprinnelig:</span> {message.raw_message}
                </div>
                <div className="mt-1 flex justify-between text-sm text-gray-500">
                  <span>
                    Sendt av: {message.expand?.user?.name || 'Unknown user'}
                  </span>
                  <span>{formatDate(message.created)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Received Messages Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Mottatte meldinger</h2>
        {receivedMessages.length === 0 ? (
          <p className="text-gray-500">Ingen mottatte meldinger enda.</p>
        ) : (
          <div className="space-y-4">
            {receivedMessages.map((message) => (
              <div key={message.id} className="border-b border-gray-200 pb-3">
                <div className="font-medium">{message.message}</div>
                <div className="mt-1 flex justify-between text-sm text-gray-500">
                  <span>From: {message.phoneNumber}</span>
                  <span>{formatDate(message.created)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}