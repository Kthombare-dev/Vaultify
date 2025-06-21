'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Maximize, Minus, Printer, Download, X } from 'lucide-react';

const PaperPreview = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            A Glimpse of the Reading Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Our clean and intuitive interface makes reading and studying a breeze.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="mt-16"
        >
          <Card className="max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Window Header */}
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FileText className="h-4 w-4" />
                <span>CS-303_Data-Structures_June-2023.pdf</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Paper Content */}
            <CardContent className="p-8 h-[600px] overflow-y-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-serif">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Data Structures</h1>
                <div className="text-right">
                  <p className="font-semibold">B. Tech. (CSE) 3rd Semester</p>
                  <p className="text-sm text-gray-500">Examination, June-2023</p>
                </div>
              </div>
              
              <div className="text-sm flex justify-between font-medium mb-4 pb-2 border-b-2">
                <span>Time: Three Hours</span>
                <span>Maximum Marks: 70</span>
              </div>

              <p className="text-sm font-semibold mb-6">Note: Attempt any five questions. All questions carry equal marks.</p>

              <div className="space-y-6 text-base text-justify">
                <div>
                  <h2 className="font-bold mb-2">Q.1 a) What is a Data Structure? Explain different types of data structures with examples.</h2>
                  <p className="pl-4 text-gray-700 dark:text-gray-300">
                    A data structure is a specialized format for organizing, processing, retrieving and storing data. There are several basic and advanced types of data structures, all designed to arrange data to suit a specific purpose. Data structures make it easy for users to access and work with the data they need in appropriate ways...
                  </p>
                </div>
                <div>
                  <h2 className="font-bold mb-2">Q.1 b) Write an algorithm to insert an element into an array at a specified position.</h2>
                   <p className="pl-4 text-gray-700 dark:text-gray-300">
                    To insert an element into an array at a specified position, you first need to check if the array is full. If not, you shift all elements from the specified position to the right by one, to create space for the new element. Then, you can insert the new element at the desired position...
                  </p>
                </div>
                <Separator className="my-4" />
                <div>
                  <h2 className="font-bold mb-2">Q.2 a) What is a stack? Explain the PUSH and POP operations with examples.</h2>
                  <p className="pl-4 text-gray-700 dark:text-gray-300">
                    A stack is a linear data structure that follows the LIFO (Last-In, First-Out) principle. It has one end, called the top, from which elements are added or removed. The PUSH operation adds an element to the top of the stack, while the POP operation removes the element from the top...
                  </p>
                </div>
                 <div>
                  <h2 className="font-bold mb-2">Q.2 b) Convert the following infix expression to postfix expression: (A + B) * C - (D - E) * (F + G)</h2>
                  <p className="pl-4 text-gray-700 dark:text-gray-300">
                    To convert an infix expression to postfix, you can use a stack. The general idea is to scan the infix expression from left to right. If you see an operand, append it to the postfix string. If you see an operator, pop operators from the stack that have higher or equal precedence and append them to the postfix string...
                  </p>
                </div>
                <Separator className="my-4" />
                <div>
                  <h2 className="font-bold mb-2">Q.3 a) Differentiate between a queue and a circular queue. Give the advantages of a circular queue.</h2>
                   <p className="pl-4 text-gray-700 dark:text-gray-300">
                    A standard queue is a linear data structure that follows the FIFO (First-In, First-Out) principle. A circular queue is a linear data structure in which the operations are performed based on FIFO principle and the last position is connected back to the first position to make a circle. The main advantage of a circular queue is better memory utilization...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PaperPreview; 