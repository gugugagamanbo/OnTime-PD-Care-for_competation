CREATE POLICY "Users can delete own logs"
  ON public.medication_logs
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);
