/*
  # Add webhook trigger for contact form notifications

  1. Changes
    - Create webhook trigger for contact_messages table
    - Trigger notify-contact-form edge function on INSERT

  2. Notes
    - Ensures email notifications are sent for every new contact message
    - Uses built-in http_request function for webhook call
*/

-- Create the webhook trigger
CREATE OR REPLACE FUNCTION notify_contact_form()
RETURNS TRIGGER AS $$
BEGIN
  -- Make HTTP request to edge function
  PERFORM
    net.http_post(
      url := CASE 
        WHEN current_setting('app.settings.http_port', TRUE) = '54321' THEN
          'http://localhost:54321/functions/v1/notify-contact-form'
        ELSE
          current_setting('app.settings.base_url') || '/functions/v1/notify-contact-form'
        END,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'record', row_to_json(NEW)
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS contact_form_notification_trigger ON contact_messages;

-- Create the trigger
CREATE TRIGGER contact_form_notification_trigger
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_form();