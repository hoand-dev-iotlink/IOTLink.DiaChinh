var Problem = (function () {
    return {

        /**
        * Tính độ dài AB biết tọa độ 2 điểm đó
        *
        * @static
        * @public
        * @this Demo.Problem
        * @memberof Demo.Problem
        * @param   {number}    xA    tọa độ X điểm A
        * @param   {number}    yA    tọa độ Y điểm B
        * @param   {number}    xB    tọa độ X điểm B
        * @param   {number}    yB    tọa độ Y điểm B
        * @return  {number}          Chiều dài đoạn AB
        */
        getLengthInverseProblem: function (xA, yA, xB, yB) {
            var dentaX_AB = xB - xA;
            var dentaY_AB = yB - yA;
            return Math.sqrt(dentaX_AB * dentaX_AB + dentaY_AB * dentaY_AB);
        },

        /**
         * Tính góc phương vị cạnh AB
         *
         * @static
         * @public
         * @this Demo.Problem
         * @memberof Demo.Problem
         * @param   {number}    xA    tọa độ X điểm A
         * @param   {number}    yA    tọa độ Y điểm A
         * @param   {number}    xB    tọa độ X điểm B
         * @param   {number}    yB    tọa độ Y điểm B
         * @return  {number}          Góc phương vị cạnh AB tính theo radian
         */
        getAngleInverseProblem: function (xA, yA, xB, yB) {
            var dentaX_AB = xB - xA;
            var dentaY_AB = yB - yA;
            var r = Math.atan(Math.abs(dentaX_AB / dentaY_AB));
            if (dentaX_AB > 0 && dentaY_AB >= 0) {
                return r;
            } else if (dentaX_AB > 0 && dentaY_AB <= 0) {
                //return (r + Math.PI / 2);//Error (use<=> dentaY/dentaX)
                return (-r + Math.PI);
            } else if (dentaX_AB < 0 && dentaY_AB <= 0) {
                return (r + Math.PI);
            } else if (dentaX_AB < 0 && dentaY_AB > 0) {
                //return (r + 3 * Math.PI / 2);//
                return (-r + 2 * Math.PI); //

            } else {
                return 0;
            }
        },

        /**
         * Giải phương trình bậc 2
         *
         * @static
         * @public
         * @this Demo.Problem
         * @memberof Demo.Problem
         * @param   {number}           hsA    hệ số a
         * @param   {number}           hsB    hệ số b
         * @param   {number}           hsC    hệ số c
         * @param   {System.Double}    x1     nghiệm 1
         * @param   {System.Double}    x2     nghiệm 2
         * @return  {number}     -1: phương trình bậc nhất,
         0: phương trình vô nghiệm,
         1: phương trình có nghiệm kép,
         2: phương trình có hai nghiệm phân biệt
         */
        gptb2: function (hsA, hsB, hsC, x1, x2) {
            if (hsA === 0.0) {
                x1.v = 0;
                x2.v = 0;
                return -1;
            } else {
                var denta = hsB * hsB - 4 * hsA * hsC;
                if (denta < 0) {
                    x1.v = 0;
                    x2.v = 0;
                    return 0;
                } else if (denta === 0) {
                    x1.v = -hsB / (2 * hsA);
                    x2.v = x1.v;
                    return 1;
                } else {
                    x1.v = (-hsB - Math.sqrt(denta)) / (2 * hsA);
                    x2.v = (-hsB + Math.sqrt(denta)) / (2 * hsA);
                    return 2;
                }
            }
        }
    }
}());
