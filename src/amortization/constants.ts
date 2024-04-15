export const queryCreateTemporaryTable = `     
CREATE TEMP TABLE temp_amortization_schedule (
    payment_number INT,
    payment_date DATE,
    beginning_balance NUMERIC(10, 2),
    payment_amount NUMERIC(10, 2),
    principal_amount NUMERIC(10, 2),
    interest_amount NUMERIC(10, 2),
    ending_balance NUMERIC(10, 2)
);
    `;

export const queryCreateProcedure = ` CREATE OR REPLACE FUNCTION generate_amortization_schedule(
        loan_amount NUMERIC,
        interest_rate NUMERIC, -- Renamed parameter to interest_rate
        total_payments INTEGER,
        interest_rate_recycled NUMERIC,
        month_recalculate_loan NUMERIC
        
    ) RETURNS TABLE (
        payment_number INT,
        payment_date DATE,
        principal_balance NUMERIC,
        total_payment_due NUMERIC,
        principal_amount NUMERIC,
        computed_interest_due NUMERIC,
        ending_balance NUMERIC,
        annual_interest_rate NUMERIC
    ) AS $$
    DECLARE
        current_balance NUMERIC := loan_amount;
        monthly_interest_rate NUMERIC := interest_rate / 12 / 100; -- Use renamed parameter
        monthly_payment NUMERIC := 0; -- Initialize monthly payment
        current_number NUMERIC := 0;
        month_recalculate_loan  NUMERIC := month_recalculate_loan;
        annual_interest_rate_table NUMERIC:= interest_rate;
         i INT := 1;
    BEGIN
    annual_interest_rate := interest_rate;
        IF total_payments <= 0 THEN
            RAISE EXCEPTION 'Total payments should be greater than 0';
        END IF;
    
        IF interest_rate <= 0 THEN -- Use renamed parameter
            RAISE EXCEPTION 'Annual interest rate should be greater than 0';
        END IF;
    
      
       payment_date := CURRENT_DATE;-- Initialize payment date
        -- Calculate monthly payment
        IF monthly_interest_rate <> 0 THEN
            monthly_payment := loan_amount * (monthly_interest_rate * POWER(1 + monthly_interest_rate, total_payments)) / (POWER(1 + monthly_interest_rate, total_payments) - 1);
        ELSE
            monthly_payment := loan_amount / total_payments; -- If interest rate is 0, evenly distribute the payments
        END IF;
    
        -- Loop through payments
        FOR i IN 1..month_recalculate_loan LOOP
            -- Set payment date
            payment_date := (payment_date + INTERVAL '1 month')::DATE;
          
            -- Set payment number
            payment_number := i;
            
        -- Set payment number globbaly
            current_number := i;
            
            -- Set beginning balance
            principal_balance := current_balance;
    
            -- Set payment amount
            IF i <= total_payments THEN
                total_payment_due := ROUND(monthly_payment, 2);
            ELSE
                -- Adjust payment amount for additional payments after 12th payment
                
               
    
                -- Set fixed interest amount for additional payments
                computed_interest_due := ROUND(current_balance * monthly_interest_rate, 2);
                -- Adjust principal amount for additional payments
                principal_amount := ROUND( total_payment_due - computed_interest_due, 2);
                
            END IF;
    
            -- Calculate interest amount for regular payments
            IF i <= total_payments THEN
                computed_interest_due := ROUND(current_balance * monthly_interest_rate, 2);
            END IF;
    
            -- Calculate principal amount for regular payments
            principal_amount := ROUND( total_payment_due - computed_interest_due, 2);
    
            -- Ensure ending balance doesn't go below 0
            IF current_balance - principal_amount < 0 THEN
                principal_amount := current_balance;
                ending_balance := 0;
            ELSE
                ending_balance := ROUND(current_balance - principal_amount, 2);
            END IF;
    
            -- Output row for the current payment
            RETURN NEXT;
    
            -- Update current balance for the next iteration
            current_balance := ending_balance;
            
        END LOOP;
           -- Loop through payments after 12 payment
        IF current_number >  month_recalculate_loan - 1 THEN          
        
        -- Recalculate monthly payment
                    IF monthly_interest_rate <> 0 THEN
                        monthly_payment := current_balance * (monthly_interest_rate * POWER(1 + monthly_interest_rate, total_payments - i)) / (POWER(1 + monthly_interest_rate, total_payments - i) - 1);
                    ELSE
                        monthly_payment := current_balance / total_payments; -- If interest rate is 0, evenly distribute the payments
                    END IF;			
            
          FOR i IN 1..total_payments LOOP   
          
             payment_number := 	 month_recalculate_loan + i	;	
    
            -- Set payment amount
            IF i <= total_payments THEN
                total_payment_due := ROUND(monthly_payment, 2);
            ELSE      		           
                -- Set fixed interest amount for additional payments
                computed_interest_due := ROUND(current_balance * monthly_interest_rate, 2);
                -- Adjust principal amount for additional payments
                principal_amount := ROUND( total_payment_due - computed_interest_due, 2);
                
            END IF;
    
            -- Calculate interest amount for regular payments
            IF i <= total_payments THEN
                computed_interest_due := ROUND(current_balance * monthly_interest_rate, 2);
            END IF;
    
            -- Calculate principal amount for regular payments
            principal_amount := ROUND( total_payment_due - computed_interest_due, 2);
    
            -- Ensure ending balance doesn't go below 0
            IF current_balance - principal_amount < 0 THEN
                principal_amount := current_balance;
                ending_balance := 0;
            ELSE
                ending_balance := ROUND(current_balance - principal_amount, 2);
            END IF;
    
            -- Output row for the current payment
            RETURN NEXT;
    
            -- Update current balance for the next iteration
            current_balance := ending_balance;
            annual_interest_rate := interest_rate_recycled;
        END LOOP;
              
        END IF;
    
    END;
    $$ LANGUAGE plpgsql;
`;
